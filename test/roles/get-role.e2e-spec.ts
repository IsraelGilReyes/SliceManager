import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Roles - Consultar roles (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let testRoleId: number;
  let roleName: string;
  let nonexistentRoleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Crear un rol únicamente para estas pruebas
    roleName = `ROL_GET_E2E_${Date.now()}`;

    const role = await prisma.role.create({
      data: {
        name: roleName,
      },
    });

    testRoleId = role.id;

    // Generar un ID que sabemos que no existe
    const lastRole = await prisma.role.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    nonexistentRoleId = (lastRole?.id ?? 0) + 1000;
  });

  afterAll(async () => {
    await prisma.role.delete({
      where: {
        id: testRoleId,
      },
    });

    await app.close();
  });

  it('debe obtener la lista de roles', async () => {
    const response = await request(app.getHttpServer())
      .get('/roles')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: testRoleId,
          name: roleName,
        }),
      ]),
    );
  });

  it('debe obtener un rol por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/roles/${testRoleId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: testRoleId,
      name: roleName,
    });
  });

  it('debe retornar 404 si el rol no existe', async () => {
    const response = await request(app.getHttpServer())
      .get(`/roles/${nonexistentRoleId}`)
      .expect(404);

    expect(response.body.message).toBe(
      `El rol con ID ${nonexistentRoleId} no existe.`,
    );
  });
});