import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Buscar al usuario en MySQL incluyendo su rol
    const user = await this.prisma.client.user.findUnique({
      where: { email },
      include: { role: true },
    });

    // 2. Verificar si el usuario existe y si la contraseña coincide
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Crear el payload del JWT con sus datos y su rol (Cajero, Gerente, etc.)
    const payload = { email: user.email, sub: user.id, role: user.role.name };

    // 4. Firmar y retornar el token de acceso
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}