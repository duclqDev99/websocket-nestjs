import {
  BaseEntity as TypeOrmBaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
