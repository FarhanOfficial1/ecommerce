import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../Admin/Admin.Entity';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity) private userRepository: Repository<AdminEntity>,
  ) {}

  async generateTwoFactorSecret(userId: number): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Generate a secret using speakeasy
    const secret = speakeasy.generateSecret({
      name: `MyApp (${user.email})`, // Custom name for the app
    });

    // Save the secret in the database
    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    // Generate a QR code
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);

    return { secret: secret.base32, qrCode };
  }

  /**
   * Enable 2FA for a user
   */
  async enableTwoFactor(userId: number, token: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.twoFactorSecret) {
      throw new Error('User not found or 2FA secret not set');
    }

    // Verify the token
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new Error('Invalid token');
    }

    // Enable 2FA
    user.isTwoFactorEnabled = true;
    await this.userRepository.save(user);

    return true;
  }

  /**
   * Validate a 2FA token for a user
   */
  async validateTwoFactorToken(userId: number, token: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.twoFactorSecret) {
      throw new Error('User not found or 2FA secret not set');
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
  }

  async disableTwoFactor(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null; // Optional: Clear the secret
    await this.userRepository.save(user);
  }
}
