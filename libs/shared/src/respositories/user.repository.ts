import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { UserRepositoryInterface } from '../interfaces/repository/users.repository.interface';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
