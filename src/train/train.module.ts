import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from './train.entity';
@Module({
  imports : [TypeOrmModule.forFeature([Train])],
  controllers: [TrainController],
  providers: [TrainService]
})
export class TrainModule {}
