import { Entity , PrimaryGeneratedColumn , Column , OneToMany ,ManyToMany, JoinTable } from "typeorm";
import { Booking } from "src/booking/booking.entity";
import { Station } from "src/station/station.entity";


@Entity()
export class Train { 
   
    @PrimaryGeneratedColumn()
    trainId : number ;

    @Column()
    trainName : string ;

    @Column()
    trainNumber : string ;

    @OneToMany(() => Booking , booking => booking.train)
    bookings : Booking [];
    
    @ManyToMany(() => Station , station => station.trains ,{
         cascade :true,
         onDelete:'CASCADE'
    })
    stations : Station [];
  

}




