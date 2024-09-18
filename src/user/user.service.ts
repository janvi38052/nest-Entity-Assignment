import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Booking } from 'src/booking/booking.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['bookings'] });
  }

  async findOne(userId: number): Promise<User> {
    return this.userRepository.findOne({
      where: { userId },
      relations: ['bookings'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    // Fetch bookings to associate with the user
    const bookings = await this.bookingRepository.findByIds(createUserDto.bookingIds);
    user.bookings = bookings;

    return this.userRepository.save(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(userId, updateUserDto);
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
