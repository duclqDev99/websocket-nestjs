import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class RoomParticipantsUser1712495499986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'room_participants_user',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
            length: '20',
            unsigned: true
          },
          {
            name: 'room_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
            length: '20',
            unsigned: true
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: false,
            length: '20',
            unsigned: true
          },
          {
            name: 'created_at',
            type: 'DATETIME',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'DATETIME',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'room_participants_user',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'room_participants_user',
      new TableForeignKey({
        columnNames: ['room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'room',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'room_participants_user',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'room_participants_user',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('room_participants_user');
    const foreignKeys = table.foreignKeys.filter((fk) =>
      ['user_id', 'room_id', 'created_by', 'updated_by'].includes(
        fk.columnNames[0],
      ),
    );

    for (const fk of foreignKeys) {
      await queryRunner.dropForeignKey('room_participants_user', fk);
    }

    await queryRunner.dropTable('room_participants_user', true);
  }
}
