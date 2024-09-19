import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from 'src/booking/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @OneToMany(() => Booking, booking => booking.user, {
    cascade: true,        // This will enable cascade operations (e.g., persist, remove)
    onDelete: 'CASCADE'   // This will delete all related bookings when a user is deleted
  })
  bookings: Booking[];
}
