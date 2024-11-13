import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'connected_users' })
export class ConnectedUser extends BaseEntity {
  @Column()
  user_id: string;

  @Column()
  socket_id: string;

  @ManyToOne(() => User, (user) => user.connectedUsers)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
