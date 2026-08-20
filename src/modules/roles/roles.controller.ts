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

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los roles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida correctamente',
    type: [RoleEntity],
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un rol por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del rol',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado correctamente',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'El rol no existe',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo rol',
  })
  @ApiBody({
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado correctamente',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol con ese nombre',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un rol existente',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del rol',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado correctamente',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'El rol no existe',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol con ese nombre',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un rol',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del rol',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado correctamente',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'El rol no existe',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}