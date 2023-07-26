import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { MessageEntity } from './message.entity';
import { CartEntity } from './cart.entity';
import { ConversationEntity } from './conversation.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations: ConversationEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart: CartEntity;
}
