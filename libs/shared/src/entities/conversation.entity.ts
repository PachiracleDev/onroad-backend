import {
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @UpdateDateColumn({
    name: 'last_updated',
  })
  lastUpdated: Date;
}
