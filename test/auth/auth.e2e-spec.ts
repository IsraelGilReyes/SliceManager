import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.setTimeout(30000);

describe('Auth - Login y perfil (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let accessToken: string;
  let testUserId: number;
  let testRoleId: number;

  const email = `usuario_e2e_${Date.now()}@test.com`;
  const password = 'Password123!';
  const roleName = `ROL_AUTH_E2E_${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    const role = await prisma.client.role.create({
      data: {
        name: roleName,
      },
    });

    testRoleId = role.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.client.user.create({
      data: {
        name: 'Usuario E2E',
        email,
        password: hashedPassword,
        roleId: testRoleId,
      },
    });

    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.client.user.deleteMany({
      where: {
        id: testUserId,
      },
    });

    await prisma.client.role.deleteMany({
      where: {
        id: testRoleId,
      },
    });

    await app.close();
  });

  it('debe autenticar al usuario y retornar un token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        pass: password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(email);
    expect(response.body).toHaveProperty('access_token');

    accessToken = response.body.access_token;
  });

  it('debe retornar 401 al acceder al perfil sin token', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });

  it('debe acceder al perfil utilizando un token válido', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.email).toBe(email);
  });
});