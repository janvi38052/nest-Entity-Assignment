import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Train } from '../train/train.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  bookingId: number;

  @Column()
  bookingDate: Date;

  @ManyToOne(() => User, user => user.bookings, {
    cascade: ['insert', 'update'], 
    onDelete: 'CASCADE' 
  })
  user: User;

  @ManyToOne(() => Train, train => train.bookings, {
    cascade: ['insert', 'update'], 
    onDelete: 'CASCADE' 
  })
  train: Train;
}
