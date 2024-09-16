import { Booking } from "src/booking/booking.entity";
import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";


@Entity()
export class User{
      @PrimaryGeneratedColumn()
      userId: number;

      
      @Column()
      firstName: string;


      @Column()
      lastName: string;


      @Column()
      email: string


    @OneToMany(() => Booking , booking => booking.user)
      bookings: Booking[];

    }








