import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Booking } from '../booking/booking.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    private readonly dataSource: DataSource, // Injected Datasource for transaction Management
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
    const queryRunner = this.dataSource.createQueryRunner(); // Create a new QueryRunner instance
    await queryRunner.startTransaction(); // Start the transaction

    try {
      const user = this.userRepository.create(createUserDto);

      // Fetch bookings to associate with the user
      const bookings = await this.bookingRepository.findByIds(createUserDto.bookingIds || []);
      user.bookings = bookings;

      // Save the user using the QueryRunner
      await queryRunner.manager.save(user);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return user;

    } catch (error) {
      // Rollback the transaction if an error occurs
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      // Release the QueryRunner
      await queryRunner.release();
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner(); // Create a new QueryRunner instance
    await queryRunner.startTransaction(); // Start the transaction

    try {
      // Fetch the existing user
      const user = await queryRunner.manager.findOne(User, { where: { userId }, relations: ['bookings'] });

      if (!user) {
        throw new Error('User not found');
      }

      // Update the user with new data
      queryRunner.manager.merge(User, user, updateUserDto);

      // Handle updates to the bookings if provided
      if (updateUserDto.bookingIds) {
        const bookings = await this.bookingRepository.findByIds(updateUserDto.bookingIds);
        user.bookings = bookings;
      }

      // Save the updated user
      await queryRunner.manager.save(user);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return user;

    } catch (error) {
      // Rollback the transaction if an error occurs
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      // Release the QueryRunner
      await queryRunner.release();
    }
  }

  async remove(userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner(); // Create a new QueryRunner instance
    await queryRunner.startTransaction(); // Start the transaction

    try {
      // Delete the user using the QueryRunner
      await queryRunner.manager.delete(User, userId);

      // Commit the transaction
      await queryRunner.commitTransaction();

    } catch (error) {
      // Rollback the transaction if an error occurs
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      // Release the QueryRunner
      await queryRunner.release();
    }
  }
}
