import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Message1712494097249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'message',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'room_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'text',
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
      'message',
      new TableForeignKey({
        columnNames: ['room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'room',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'message',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'message',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('message');

    const roomForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('room_id') !== -1,
    );
    if (roomForeignKey) {
      await queryRunner.dropForeignKey('message', roomForeignKey);
    }

    const createdByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by') !== -1,
    );
    if (createdByForeignKey) {
      await queryRunner.dropForeignKey('message', createdByForeignKey);
    }

    const updatedByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('updated_by') !== -1,
    );
    if (updatedByForeignKey) {
      await queryRunner.dropForeignKey('message', updatedByForeignKey);
    }

    await queryRunner.dropTable('message', true);
  }
}
