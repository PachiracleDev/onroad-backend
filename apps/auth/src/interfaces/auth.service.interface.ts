import { UserEntity } from '@app/shared/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenInterface } from './token.interface';
import { SigninDto } from '../dto/signin-dto';

export interface AuthServiceInterface {
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(dto: CreateUserDto): Promise<{ access_token: string }>;
  validateUser(email: string, password: string): Promise<UserEntity>;
  login(dto: SigninDto): Promise<{ access_token: string }>;
  verifyJwtToken(token: string): Promise<TokenInterface>;
  decodeJwtToken(token: string): Promise<TokenInterface>;
  signJwtToken(payload: { role: string; sub: number }): Promise<string>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  getOnroadsTeam(userId: number): Promise<UserEntity[]>;
  getUserById(id: number): Promise<UserEntity>;
}
