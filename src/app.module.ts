import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TrainModule } from './train/train.module';
import { BookingModule } from './booking/booking.module';
import { StationModule } from './station/station.module';
import { User } from './user/user.entity';
import { Booking } from './booking/booking.entity';
import { Train } from './train/train.entity';
import { Station } from './station/station.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'entity',
      entities: [User, Booking , Train, Station],
      synchronize: true,
    }),
    UserModule,
    TrainModule,
    BookingModule,
    StationModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
