import { DataSource } from 'typeorm';
import { User } from './user/user.entity'; 
import { Train } from './train/train.entity';
import { Station } from './station/station.entity';
import { Booking } from './booking/booking.entity';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",          
    password: "admin",         
    database: "datas",           
    entities: [User, Train, Station, Booking],
    migrations: ["src/migrations/*.ts"],  
    synchronize: false,  
    logging: true,       
});
