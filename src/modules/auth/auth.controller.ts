import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Esto crea la ruta POST http://localhost:3000/auth/login
  @Post('login')
  async login(@Body() body: { email: string; pass: string }) {
    // Le pasamos el email y la contraseña directas a tu servicio
    return this.authService.login(body.email, body.pass);
  }
}