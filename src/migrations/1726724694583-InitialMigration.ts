import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialMigration1726724694583 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                { name: 'userId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'firstName', type: 'varchar' },
                { name: 'lastName', type: 'varchar' },
                { name: 'email', type: 'varchar', isUnique: true },
            ],
        }), true);

        
        await queryRunner.createTable(new Table({
            name: 'train',
            columns: [
                { name: 'trainId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'trainName', type: 'varchar' },
                { name: 'trainNumber', type: 'varchar', isUnique: true },
            ],
        }), true);

       
        await queryRunner.createTable(new Table({
            name: 'station',
            columns: [
                { name: 'stationId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'stationName', type: 'varchar' },
            ],
        }), true);

      
        await queryRunner.createTable(new Table({
            name: 'booking',
            columns: [
                { name: 'bookingId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'bookingDate', type: 'date' },
                { name: 'userId', type: 'int' },
                { name: 'trainId', type: 'int' },
            ],
        }), true);

        //Booking -> User
        await queryRunner.createForeignKey('booking', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['userId'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));

        //  Booking -> Train
        await queryRunner.createForeignKey('booking', new TableForeignKey({
            columnNames: ['trainId'],
            referencedColumnNames: ['trainId'],
            referencedTableName: 'train',
            onDelete: 'CASCADE',
        }));

        // Create many-to-many relation between Train and Station
        await queryRunner.createTable(new Table({
            name: 'train_stations_station',
            columns: [
                { name: 'trainId', type: 'int', isPrimary: true },
                { name: 'stationId', type: 'int', isPrimary: true },
            ],
        }), true);

        //  Train -> Station (many-to-many relation)
        await queryRunner.createForeignKey('train_stations_station', new TableForeignKey({
            columnNames: ['trainId'],
            referencedColumnNames: ['trainId'],
            referencedTableName: 'train',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('train_stations_station', new TableForeignKey({
            columnNames: ['stationId'],
            referencedColumnNames: ['stationId'],
            referencedTableName: 'station',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.dropTable('train_stations_station', true);

        
        await queryRunner.dropForeignKey('booking', 'userId');
        await queryRunner.dropForeignKey('booking', 'trainId');

        
        await queryRunner.dropTable('booking');
        await queryRunner.dropTable('train');
        await queryRunner.dropTable('station');
        await queryRunner.dropTable('user');
    }
}
