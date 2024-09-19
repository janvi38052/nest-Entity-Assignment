export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  bookingIds?: number[]; // Optional if not always provided
}

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  bookingIds?: number[]; // Optional if not always provided
}
