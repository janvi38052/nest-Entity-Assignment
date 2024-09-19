import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Train } from './train.entity';
import { CreateTrainDto, UpdateTrainDto } from './train.dto';
import { Booking } from 'src/booking/booking.entity';
import { Station } from 'src/station/station.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,

    private readonly dataSource: DataSource, 
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newTrain = this.trainRepository.create(createTrainDto);

      if (createTrainDto.bookingIds) {
        newTrain.bookings = await this.bookingRepository.findByIds(createTrainDto.bookingIds);
      }

      if (createTrainDto.stationIds) {
        newTrain.stations = await this.stationRepository.findByIds(createTrainDto.stationIds);
      }

      await queryRunner.manager.save(newTrain);
      await queryRunner.commitTransaction();

      return newTrain;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Train[]> {
    return this.trainRepository.find({ relations: ['bookings', 'stations'] });
  }

  async findOne(trainId: number): Promise<Train> {
    return this.trainRepository.findOne({
      where: { trainId },
      relations: ['bookings', 'stations'],
    });
  }

  async update(trainId: number, updateTrainDto: UpdateTrainDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const train = await this.trainRepository.findOne({
        where: { trainId },
        relations: ['bookings', 'stations'],
      });

      if (!train) throw new Error('Train not found');

      Object.assign(train, updateTrainDto);

      if (updateTrainDto.bookingIds) {
        train.bookings = await this.bookingRepository.findByIds(updateTrainDto.bookingIds);
      }

      if (updateTrainDto.stationIds) {
        train.stations = await this.stationRepository.findByIds(updateTrainDto.stationIds);
      }

      await queryRunner.manager.save(train);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(trainId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Train, trainId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
