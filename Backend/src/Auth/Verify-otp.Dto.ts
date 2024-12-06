// verify-otp.dto.ts
import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  otp: string; // OTP from the user
}