import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'room_participants_user' })
export class RoomParticipantsUser extends BaseEntity {
  @Column()
  user_id: string;

  @Column()
  room_id: string;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;
}
