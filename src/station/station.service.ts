import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDto, UpdateStationDto } from './station.dto';
import { Train } from 'src/train/train.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,

    @InjectRepository(Train) 
    private trainRepository: Repository<Train>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const newStation = this.stationRepository.create(createStationDto);
    return this.stationRepository.save(newStation);
  }

  async findAll(): Promise<Station[]> {
    return this.stationRepository.find({ relations: ['trains'] });
  }

  async findOne(stationId: number): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { stationId },
      relations: ['trains'],
    });
    if (!station) {
      throw new NotFoundException(`Station with ID ${stationId} not found`);
    }
    return station;
  }

  async update(stationId: number, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.findOne(stationId);
    Object.assign(station, updateStationDto);
    return this.stationRepository.save(station);
  }

  async remove(stationId: number): Promise<void> {
    const station = await this.findOne(stationId);
    await this.stationRepository.remove(station);
  }


  async addTrainToStation(stationId: number, trainId: number): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { stationId }, relations: ['trains'] });
    if (!station) {
      throw new NotFoundException(`Station with ID ${stationId} not found`);
    }

    const train = await this.trainRepository.findOne({ where: { trainId } });
    if (!train) {
      throw new NotFoundException(`Train with ID ${trainId} not found`);
    }

    station.trains.push(train); 
    return this.stationRepository.save(station); 
  }
}
