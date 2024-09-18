import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDto, UpdateStationDto } from './station.dto';
import { Train } from 'src/train/train.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const { stationName, trainIds } = createStationDto;
    const newStation = this.stationRepository.create({ stationName });

    if (trainIds && trainIds.length > 0) {
      const trains = await this.trainRepository.findByIds(trainIds);
      newStation.trains = trains;
    }

    return this.stationRepository.save(newStation);
  }

  async findAll(): Promise<Station[]> {
    return this.stationRepository.find({ relations: ['trains'] });
  }

  async findOne(stationId: number): Promise<Station> {
    return this.stationRepository.findOne({
      where: { stationId },
      relations: ['trains'],
    });
  }

  async update(stationId: number, updateStationDto: UpdateStationDto): Promise<void> {
    const { trainIds, ...updateData } = updateStationDto;
    await this.stationRepository.update(stationId, updateData);

    if (trainIds) {
      const station = await this.stationRepository.findOne({
        where: { stationId },
        relations: ['trains'],
      });
      if (station) {
        const trains = await this.trainRepository.findByIds(trainIds);
        station.trains = trains;
        await this.stationRepository.save(station);
      }
    }
  }

  async remove(stationId: number): Promise<void> {
    await this.stationRepository.delete(stationId);
  }
}
