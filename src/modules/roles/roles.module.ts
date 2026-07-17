import { Module } from '@nestjs/common';

// Controlador encargado de recibir las peticiones HTTP
import { RolesController } from './roles.controller';

// Servicio donde se encuentra la lógica del negocio
import { RolesService } from './roles.service';

// Servicio que permite acceder a la base de datos mediante Prisma
import { PrismaService } from '../../prisma/prisma.service';

// Declaramos el módulo Roles
@Module({
  // En este caso no importamos otros módulos
  imports: [],

  // Controladores pertenecientes al módulo
  controllers: [RolesController],

  // Servicios que estarán disponibles dentro del módulo
  providers: [RolesService, PrismaService],
})
export class RolesModule {}
