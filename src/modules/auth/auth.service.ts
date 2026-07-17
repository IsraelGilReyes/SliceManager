import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRO DE USUARIOS ---
  async register(registerDto: RegisterDto) {
    const { email, password, name, roleId } = registerDto;

    // 1. Verificar si ya existe el correo
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Si no mandan roleId, por defecto asignamos ID 1 (Cajero)
    const assignedRoleId = roleId ?? 1;

    // 4. Crear el usuario conectando con el Rol
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: {
          connect: { id: assignedRoleId },
        },
      },
      include: {
        role: true,
      },
    });

    // Omitir el password en la respuesta
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // --- INICIO DE SESIÓN ---
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar al usuario con su rol
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    // 2. Validar credenciales
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Payload para el JWT con el rol (Cajero o Gerente)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role.name 
    };

    // 4. Retornar token y datos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name, // "Cajero" o "Gerente"
      },
    };
  }
}