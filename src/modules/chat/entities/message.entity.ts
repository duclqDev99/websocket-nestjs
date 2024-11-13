import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @Column()
  room_id: string;

  @Column()
  text: string;

  @ManyToOne(() => Room, (roomEntity) => roomEntity.messages)
  room: Room;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  creator: User;
}
