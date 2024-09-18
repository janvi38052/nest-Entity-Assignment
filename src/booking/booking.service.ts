import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { bookingDate, userId, trainId } = createBookingDto;

    const user = await this.userRepository.findOne({ where: { userId } });
    const train = await this.trainRepository.findOne({ where: { trainId } });

    const newBooking = this.bookingRepository.create({
      bookingDate,
      user,
      train,
    });

    return this.bookingRepository.save(newBooking);
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
    const booking = await this.findOne(bookingId);
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async remove(bookingId: number): Promise<void> {
    await this.bookingRepository.delete(bookingId);
  }
}
