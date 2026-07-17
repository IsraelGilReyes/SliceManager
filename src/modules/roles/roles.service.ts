import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// Servicio encargado de comunicarse con la base de datos mediante Prisma
import { PrismaService } from '../../prisma/prisma.service';

// DTO utilizados para crear y actualizar roles
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

// Convierte esta clase en un servicio que NestJS puede inyectar
@Injectable()
export class RolesService {
  // Inyectamos PrismaService para acceder a la base de datos
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los roles registrados
   * GET /roles
   */
  async findAll() {
    return this.prisma.role.findMany({
      orderBy: {
        // Ordena alfabéticamente por nombre
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene un rol por su ID
   * GET /roles/:id
   */
  async findOne(id: number) {
    // Busca un único registro mediante su llave primaria
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    // Si no existe, responde con un error 404
    if (!role) {
      throw new NotFoundException(`El rol con ID ${id} no existe.`);
    }

    return role;
  }

  /**
   * Crea un nuevo rol
   * POST /roles
   */
  async create(createRoleDto: CreateRoleDto) {
    // Verificamos que no exista otro rol con el mismo nombre
    const exists = await this.prisma.role.findUnique({
      where: {
        name: createRoleDto.name,
      },
    });

    // Si ya existe, respondemos con error 409
    if (exists) {
      throw new ConflictException(
        `Ya existe un rol con el nombre "${createRoleDto.name}".`,
      );
    }

    // Si todo está correcto, insertamos el nuevo registro
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  /**
   * Actualiza un rol existente
   * PATCH /roles/:id
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Primero verificamos que el rol exista
    await this.findOne(id);

    // Después actualizamos únicamente los campos enviados
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  /**
   * Elimina un rol
   * DELETE /roles/:id
   */
  async remove(id: number) {
    // Validamos que exista antes de eliminarlo
    await this.findOne(id);

    // Eliminación física del registro
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
