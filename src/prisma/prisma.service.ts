import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public client: PrismaClient;

  constructor() {
    // Desglosamos los datos manualmente para que mariadb cree el pool sin romperse internamente
    const pool = mariadb.createPool({
      host: 'localhost',
      port: 3306,
      user: 'isra',
      password: 'g23292034',
      database: 'pizzeria_db',
      connectionLimit: 5
    });

    // Inicializamos el adaptador oficial pasando el pool
    const adapter = new PrismaMariaDb(pool as any);

    // Creamos la instancia inyectando el adaptador que exige tu prisma.config.ts
    this.client = new PrismaClient({ adapter } as any);
  }

  get user() { return this.client.user; }
  get role() { return this.client.role; }
  get product() { return this.client.product; }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}