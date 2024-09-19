import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './booking.dto';
import { User } from '../user/user.entity';
import { Train } from '../train/train.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { bookingDate, userId, trainId } = createBookingDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOneBy({ userId });
      const train = await this.trainRepository.findOneBy({ trainId });

      if (!user || !train) {
        throw new Error('User or Train not found');
      }

      const newBooking = this.bookingRepository.create({
        bookingDate,
        user,
        train,
      });

      const booking = await queryRunner.manager.save(Booking, newBooking);

      await queryRunner.commitTransaction();
      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['user', 'train'] });
  }

  async findOne(bookingId: number): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { bookingId },
      relations: ['user', 'train'],
    });
  }

  async update(bookingId: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await this.findOne(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      Object.assign(booking, updateBookingDto);
      const updatedBooking = await queryRunner.manager.save(Booking, booking);

      await queryRunner.commitTransaction();
      return updatedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(bookingId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.delete(Booking, bookingId);

      if (result.affected === 0) {
        throw new Error('Booking not found');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
