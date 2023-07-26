import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BusEntity } from './bus.entity';

@Entity('operators')
export class OperatorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @OneToMany(() => BusEntity, (bus) => bus.operator)
  buses: BusEntity[];
}
