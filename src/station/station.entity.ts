import { Entity , PrimaryGeneratedColumn , Column, ManyToMany , JoinTable } from "typeorm";
import { Train } from "src/train/train.entity";

@Entity()

    export class Station {

   @PrimaryGeneratedColumn()
   stationId : number ;


   @Column()
   stationName : string ;


  @ManyToMany (() => Train , train => train.stations)
  @JoinTable()
  trains : Train[];




    }





