import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Roles - Eliminar rol (E2E)', () => {
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

    roleName = `ROL_DELETE_E2E_${Date.now()}`;

    const role = await prisma.role.create({
      data: {
        name: roleName,
      },
    });

    testRoleId = role.id;

    const lastRole = await prisma.role.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    nonexistentRoleId = (lastRole?.id ?? 0) + 1000;
  });

  afterAll(async () => {
    // Limpieza por seguridad si la prueba de DELETE falla
    await prisma.role.deleteMany({
      where: {
        id: testRoleId,
      },
    });

    await app.close();
  });

  it('debe eliminar un rol correctamente', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/roles/${testRoleId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: testRoleId,
      name: roleName,
    });

    const deletedRole = await prisma.role.findUnique({
      where: {
        id: testRoleId,
      },
    });

    expect(deletedRole).toBeNull();
  });

  it('debe retornar 404 al eliminar un rol inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/roles/${nonexistentRoleId}`)
      .expect(404);

    expect(response.body.message).toBe(
      `El rol con ID ${nonexistentRoleId} no existe.`,
    );
  });
});