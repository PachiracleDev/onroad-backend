import {
  ConflictException,
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { UserRepositoryInterface } from '@app/shared/interfaces/repository/users.repository.interface';
import { TokenInterface } from './interfaces/token.interface';
import { UserEntity } from '@app/shared/entities/user.entity';
import { Role } from '@app/shared/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  decodeJwtToken(token: string): Promise<TokenInterface> {
    if (!token) return;
    try {
      return this.jwtService.decode(token) as Promise<TokenInterface>;
    } catch (error) {
      throw new BadRequestException('El token no es válido');
    }
  }

  doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({ where: { email } });
  }

  async getOnroadsTeam(userId: number): Promise<UserEntity[]> {
    const result = await this.userRepository.findAll({
      where: { role: Role.ONROAD },
    });

    if (result.length > 1) {
      return result.filter((user) => user.id !== userId);
    }
    return result;
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyJwtToken(token: string): Promise<TokenInterface> {
    return (await this.jwtService.verifyAsync(token)) as Promise<any>;
  }

  async register(dto: CreateUserDto): Promise<{ access_token: string }> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new RpcException('El correo ya está registrado');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const savedUser = await this.userRepository.save({
      ...dto, // Debido a que en la configuración que se hizo el ValidationPipe en main.ts, se ignoran los parámetros que no están definidos en el DTO
      password: hashedPassword,
    });

    delete savedUser.password;
    const token = await this.jwtService.signAsync({
      id: savedUser.id,
      role: savedUser.role,
    });

    return {
      access_token: token,
    };
  }

  async login(dto: SigninDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new RpcException('El correo o la contraseña son incorrectos');
    }
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });
    return {
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findByCondition({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    return user;
  }

  async signJwtToken(payload: { role: string; sub: number }): Promise<string> {
    const jwt = await this.jwtService.signAsync(payload);
    return jwt;
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }
}
