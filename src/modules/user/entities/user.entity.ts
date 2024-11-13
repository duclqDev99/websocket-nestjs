import { Room } from 'src/modules/chat/entities/room.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToMany, OneToMany, Unique } from 'typeorm';
import { ConnectedUser } from 'src/modules/chat/entities/connected-user.entity';
import { Message } from 'src/modules/chat/entities/message.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  hashed_password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @ManyToMany(() => Room, (room) => room.participants)
  rooms: Room[];

  @OneToMany(() => ConnectedUser, (connectedUser) => connectedUser.user)
  connectedUsers: ConnectedUser[];

  @OneToMany(() => Message, (message) => message.creator)
  messages: Message[];
}
