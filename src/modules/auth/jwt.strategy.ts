import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token de la cabecera 'Authorization: Bearer <TOKEN>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey_pizzerialocal',
    });
  }

  // Este método se ejecuta automáticamente cuando el token es válido
  async validate(payload: any) {
    // Lo que retornes aquí se inyectará en el objeto Request (req.user)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}