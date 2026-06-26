import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service'; // <-- Asegúrate de que esta ruta sea correcta
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey_pizzerialocal',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  // ¡AQUÍ ESTÁ LA CLAVE! PrismaService DEBE estar en este arreglo:
  providers: [AuthService, JwtStrategy, PrismaService], 
})
export class AuthModule {}