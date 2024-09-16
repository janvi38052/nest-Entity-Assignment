import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './booking.dto';
import { User } from 'src/user/user.entity';
import { Train } from 'src/train/train.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { userId, trainId, ...bookingData } = createBookingDto;
    const user = await this.userRepository.findOneBy({ userId });
    const train = await this.trainRepository.findOneBy({ trainId });

    if (!user || !train) {
      throw new NotFoundException('User or Train not found');
    }

    const newBooking = this.bookingRepository.create({
      ...bookingData,
      user,
      train,
    });
    return this.bookingRepository.save(newBooking);
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['user', 'train'] });
  }

  async findOne(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId },
      relations: ['user', 'train'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }

  async update(bookingId: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    const { userId, trainId, ...updateData } = updateBookingDto;

    if (userId) {
      const user = await this.userRepository.findOneBy({ userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      booking.user = user;
    }

    if (trainId) {
      const train = await this.trainRepository.findOneBy({ trainId });
      if (!train) {
        throw new NotFoundException(`Train with ID ${trainId} not found`);
      }
      booking.train = train;
    }

    Object.assign(booking, updateData);
    return this.bookingRepository.save(booking);
  }

  async remove(bookingId: number): Promise<void> {
    const booking = await this.findOne(bookingId);
    await this.bookingRepository.remove(booking);
  }
}
