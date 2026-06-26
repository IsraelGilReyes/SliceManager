import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Obtener el reflector de NestJS para leer los metadatos de los decoradores
  const reflector = app.get(Reflector);
  
  // 2. Registrar el Guard de forma global para proteger todas las rutas de la pizzería
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 3. Mantener configuración original del puerto
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();