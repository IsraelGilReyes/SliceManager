import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsNumber()
  @IsOptional()
  roleId?: number; // Este lleva signo de interrogación ? porque es opcional
}