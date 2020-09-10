import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTransaction1597199341906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name:'transactions',
          columns:[
            {
              name:'id',
              type:'uuid',
              isPrimary:true,
              generationStrategy:'uuid',
              default:'uuid_generate_v4()'
            },{
              name:'title',
              type:'varchar'
            },{
              name:'type',
              type:'varchar'
            },{
              name:'value',
              type: 'integer'
            },{
              name:'tag_id',
              type:'uuid',
              isNullable:true
            },{
              name:'created_at',
              type:'timestamp',
              default:'now()'
            },{
              name:'updated_at',
              type:'timestamp',
              default:'now()',
          }
          ]
        })
      );

      await queryRunner.createForeignKey(
        'transactions',new TableForeignKey({
          name:'tags',
          columnNames:['tag_id'],
          referencedColumnNames:['id'],
          referencedTableName:'categories',
          onDelete:'SET NULL',
          onUpdate:'CASCADE'
        })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('transactions','tags')
      await queryRunner.dropTable('transactions')
    }

}
