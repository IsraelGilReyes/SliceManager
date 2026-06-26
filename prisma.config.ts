import * as dotenv from 'dotenv';
import * as path from 'path';
import { defineConfig } from '@prisma/config';

// Forzar la carga del archivo .env de la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});