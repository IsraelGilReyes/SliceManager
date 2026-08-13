import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  // Permite acceder al modelo Role mediante Prisma.
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los roles ordenados alfabéticamente.
   * GET /roles
   */
  async findAll() {
    return this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene un rol por su ID.
   * GET /roles/:id
   */
  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`El rol con ID ${id} no existe.`);
    }

    return role;
  }

  /**
   * Crea un nuevo rol.
   * POST /roles
   */
  async create(createRoleDto: CreateRoleDto) {
    // Verifica que el nombre no esté registrado.
    const existingRole = await this.prisma.role.findUnique({
      where: {
        name: createRoleDto.name,
      },
    });

    if (existingRole) {
      throw new ConflictException(
        `Ya existe un rol con el nombre "${createRoleDto.name}".`,
      );
    }

    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  /**
   * Actualiza un rol existente.
   * PATCH /roles/:id
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Primero comprueba que el rol exista.
    await this.findOne(id);

    // Si se cambia el nombre, comprueba que no pertenezca a otro rol.
    if (updateRoleDto.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: {
          name: updateRoleDto.name,
        },
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          `Ya existe un rol con el nombre "${updateRoleDto.name}".`,
        );
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  /**
   * Elimina físicamente un rol.
   * DELETE /roles/:id
   */
  async remove(id: number) {
    // Comprueba que exista antes de eliminarlo.
    await this.findOne(id);

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
