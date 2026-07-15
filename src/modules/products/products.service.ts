import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtiene todos los productos ordenados alfabéticamente.
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Obtiene un producto mediante su identificador.
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`No existe un producto con el id ${id}`);
    }

    return product;
  }

  // Crea un producto después de verificar que el nombre no esté registrado.
  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        name: createProductDto.name,
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Ya existe un producto con el nombre ${createProductDto.name}`,
      );
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Actualiza únicamente los campos enviados en la petición.
  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.name) {
      const productWithSameName = await this.prisma.product.findUnique({
        where: {
          name: updateProductDto.name,
        },
      });

      if (productWithSameName && productWithSameName.id !== id) {
        throw new ConflictException(
          `Ya existe un producto con el nombre ${updateProductDto.name}`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // Realiza una baja lógica para conservar el historial del producto.
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
