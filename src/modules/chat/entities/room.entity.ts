import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity({ name: 'room' })
@Unique(['name'])
export class Room extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  type: string;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable({
    name: 'room_participants_user',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  participants: User[];

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
