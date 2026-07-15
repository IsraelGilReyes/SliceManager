import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    const host = process.env.DATABASE_HOST;
    const port = Number(process.env.DATABASE_PORT ?? 3306);
    const user = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;
    const database = process.env.DATABASE_NAME;

    if (!host || !user || password === undefined || !database) {
      throw new Error(
        'Faltan variables de conexión a la base de datos en el archivo .env',
      );
    }

    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
    });

    this.client = new PrismaClient({ adapter });
  }

  get user() {
    return this.client.user;
  }

  get role() {
    return this.client.role;
  }

  get product() {
    return this.client.product;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
