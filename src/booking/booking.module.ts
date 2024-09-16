import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { User } from 'src/user/user.entity';
import { Train } from 'src/train/train.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Booking,User,Train])],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
