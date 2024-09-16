import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './train.entity';
import { CreateTrainDto , UpdateTrainDto } from './train.dto';


@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const newTrain = this.trainRepository.create(createTrainDto);
    return this.trainRepository.save(newTrain);
  }

  findAll(): Promise<Train[]> {
    return this.trainRepository.find({ relations: ['bookings', 'stations'] });
  }

  async findOne(trainId: number): Promise<Train> {
    const train = await this.trainRepository.findOne({ where: { trainId }, relations: ['bookings', 'stations'] });
    if (!train) {
      throw new NotFoundException(`Train with ID ${trainId} not found`);
    }
    return train;
  }

  async update(trainId: number, updateTrainDto: UpdateTrainDto): Promise<Train> {
    const train = await this.findOne(trainId);
    Object.assign(train, updateTrainDto);
    return this.trainRepository.save(train);
  }

  async remove(trainId: number): Promise<void> {
    const train = await this.findOne(trainId);
    await this.trainRepository.remove(train);
  }
}
