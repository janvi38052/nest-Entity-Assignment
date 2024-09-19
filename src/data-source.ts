import { DataSource } from 'typeorm';
import { User } from './user/user.entity';  // Adjust paths to your actual entities
import { Train } from './train/train.entity';
import { Station } from './station/station.entity';
import { Booking } from './booking/booking.entity';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",           // Your MySQL username
    password: "admin",           // Your MySQL password
    database: "datas",           // Your MySQL database name
    entities: [User, Train, Station, Booking], // Add your entities here
    migrations: ["src/migrations/*.ts"],  // Adjust the path to your migrations
    //migrationsTableName: "custom_migration_table", // Custom table name for migrations
    synchronize: false,  // Set to true in development only, use migrations in production
    logging: true,       // Enable logging to see executed queries
});
