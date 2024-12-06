import { Controller, Post, Param, Body } from '@nestjs/common';
import { AuthService } from './Auth.Service';

@Controller('admin')
export class AuthController {
  constructor(private adminService: AuthService) {}

  @Post('generate-2fa/:id')
  async generateTwoFactorSecret(@Param('id') id: string) {
    const result = await this.adminService.generateTwoFactorSecret(parseInt(id, 10));
    return { message: '2FA secret generated', data: result };
  }

  @Post('enable-2fa/:id')
  async enableTwoFactor(@Param('id') id: string, @Body('token') token: string) {
    const isEnabled = await this.adminService.enableTwoFactor(parseInt(id, 10), token);
    return { message: isEnabled ? '2FA enabled' : 'Failed to enable 2FA' };
  }

  @Post('validate-2fa/:id')
  async validateTwoFactor(@Param('id') id: string, @Body('token') token: string) {
    const isValid = await this.adminService.validateTwoFactorToken(parseInt(id, 10), token);
    return { message: isValid ? 'Token is valid' : 'Invalid token' };
  }

  @Post('disable-2fa/:id')
  async disableTwoFactor(@Param('id') id: number) {
    await this.adminService.disableTwoFactor(id);
    return { success: true, message: '2FA disabled successfully.' };
  }
}
