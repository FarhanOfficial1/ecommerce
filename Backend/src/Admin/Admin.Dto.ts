import { IsNotEmpty, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;

  @IsOptional()
  twoFactorSecret?: string;
}