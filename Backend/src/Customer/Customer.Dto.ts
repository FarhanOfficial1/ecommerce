import { Type } from 'class-transformer';
import {IsDate,IsEmail,IsNotEmpty,IsOptional,IsString,Matches,} from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  readonly address: string;

  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsOptional()
  @Type(() => Date) // Converts plain text to a Date object
  @IsDate({ message: 'registrationDate must be a valid date' })
  registrationDate?: Date;

  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'contactDetail must be a 10-digit number' })
  readonly contactDetail: string;
}
