import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Roles - Crear rol (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdRoleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (createdRoleId) {
      await prisma.role.delete({
        where: { id: createdRoleId },
      });
    }

    await app.close();
  });

  it('debe crear un rol correctamente', async () => {
    const roleName = `ROL_E2E_${Date.now()}`;

    const response = await request(app.getHttpServer())
      .post('/roles')
      .send({
        name: roleName,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(roleName);

    createdRoleId = response.body.id;
  });
});