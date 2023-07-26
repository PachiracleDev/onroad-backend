import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepositoryInterface } from '../interfaces/repository/message.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class MessageRepository
  extends BaseAbstractRepository<MessageEntity>
  implements MessageRepositoryInterface
{
  constructor(
    @InjectRepository(MessageEntity)
    readonly messageRepository: Repository<MessageEntity>,
  ) {
    super(messageRepository);
  }
}
