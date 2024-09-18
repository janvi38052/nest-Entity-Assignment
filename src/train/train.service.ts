import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const newTrain = this.trainRepository.create(createTrainDto);

    // Handle bookings and stations if provided
    if (createTrainDto.bookingIds) {
      newTrain.bookings = await this.bookingRepository.findByIds(createTrainDto.bookingIds);
    }

    if (createTrainDto.stationIds) {
      newTrain.stations = await this.stationRepository.findByIds(createTrainDto.stationIds);
    }

    return this.trainRepository.save(newTrain);
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
    // Update train details
    await this.trainRepository.update(trainId, updateTrainDto);

    // Fetch updated train
    const train = await this.trainRepository.findOne({
      where: { trainId },
      relations: ['bookings', 'stations'],
    });

    if (train) {
      // Update bookings if provided
      if (updateTrainDto.bookingIds) {
        train.bookings = await this.bookingRepository.findByIds(updateTrainDto.bookingIds);
      }

      // Update stations if provided
      if (updateTrainDto.stationIds) {
        train.stations = await this.stationRepository.findByIds(updateTrainDto.stationIds);
      }

      await this.trainRepository.save(train);
    }
  }

  async remove(trainId: number): Promise<void> {
    await this.trainRepository.delete(trainId);
  }
}
