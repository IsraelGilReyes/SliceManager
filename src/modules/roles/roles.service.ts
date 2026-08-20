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
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los roles registrados en el sistema.
   *
   * Los roles se devuelven ordenados alfabéticamente por nombre.
   *
   * @returns Lista de roles registrados.
   */
  async findAll() {
    return this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca un rol mediante su identificador.
   *
   * @param id Identificador único del rol.
   * @returns El rol encontrado.
   * @throws NotFoundException Si no existe un rol con el ID proporcionado.
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
   * Crea un nuevo rol en el sistema.
   *
   * Antes de crear el registro, verifica que no exista otro rol
   * con el mismo nombre.
   *
   * @param createRoleDto Datos necesarios para crear el rol.
   * @returns El rol creado.
   * @throws ConflictException Si ya existe un rol con el mismo nombre.
   */
  async create(createRoleDto: CreateRoleDto) {
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
   * Actualiza los datos de un rol existente.
   *
   * Primero verifica que el rol exista y, si se modifica el nombre,
   * comprueba que dicho nombre no pertenezca a otro rol.
   *
   * @param id Identificador único del rol que se desea actualizar.
   * @param updateRoleDto Datos que se desean modificar.
   * @returns El rol actualizado.
   * @throws NotFoundException Si el rol no existe.
   * @throws ConflictException Si el nuevo nombre ya pertenece a otro rol.
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);

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
   * Elimina físicamente un rol del sistema.
   *
   * Antes de eliminarlo, verifica que el rol exista.
   *
   * @param id Identificador único del rol que se desea eliminar.
   * @returns El rol eliminado.
   * @throws NotFoundException Si el rol no existe.
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.role.delete({
      where: { id },
    });
  }
}