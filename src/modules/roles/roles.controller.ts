import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

// DTO utilizados para crear y actualizar
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

// Servicio donde se encuentra la lógica del negocio
import { RolesService } from './roles.service';

// Todas las rutas comienzan con /roles
@Controller('roles')
export class RolesController {
  // Inyección del servicio
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Obtiene todos los roles
   * GET /roles
   */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Obtiene un rol por ID
   * GET /roles/:id
   */
  @Get(':id')
  findOne(
    // ParseIntPipe convierte automáticamente el parámetro a número
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.rolesService.findOne(id);
  }

  /**
   * Crea un nuevo rol
   * POST /roles
   */
  @Post()
  create(
    // Recibe el cuerpo de la petición y lo valida con CreateRoleDto
    @Body()
    createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Actualiza un rol existente
   * PATCH /roles/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  /**
   * Elimina un rol
   * DELETE /roles/:id
   */
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.rolesService.remove(id);
  }
}
