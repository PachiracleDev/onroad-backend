import { MessageEntity } from '../../entities/message.entity';
import { BaseInterfaceRepository } from '../../respositories/base/base.interface.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessageRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {}
