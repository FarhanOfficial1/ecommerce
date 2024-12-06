// create-two-factor.dto.ts
import { IsString } from 'class-validator';

export class CreateTwoFactorDto {
  @IsString()
  userId: number; // User ID to associate with 2FA
}