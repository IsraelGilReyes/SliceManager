import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Roles - Actualizar rol (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let testRoleId: number;
  let originalName: string;
  let updatedName: string;
  let nonexistentRoleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    originalName = `ROL_UPDATE_E2E_${Date.now()}`;

    const role = await prisma.role.create({
      data: {
        name: originalName,
      },
    });

    testRoleId = role.id;
    updatedName = `${originalName}_ACTUALIZADO`;

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

  it('debe actualizar un rol correctamente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/roles/${testRoleId}`)
      .send({
        name: updatedName,
      })
      .expect(200);

    expect(response.body).toEqual({
      id: testRoleId,
      name: updatedName,
    });
  });

  it('debe retornar 404 al actualizar un rol inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/roles/${nonexistentRoleId}`)
      .send({
        name: 'ROL_INEXISTENTE',
      })
      .expect(404);

    expect(response.body.message).toBe(
      `El rol con ID ${nonexistentRoleId} no existe.`,
    );
  });
});