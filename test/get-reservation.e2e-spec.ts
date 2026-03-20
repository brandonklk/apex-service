import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '@/modules/reservations/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';

describe('GetReservationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await prisma.reservation.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 and reservation data when id exists', async () => {
    const createResponse = await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440000',
        slotId: '550e8400-e29b-41d4-a716-446655440001',
      })
      .expect(201);

    const createdId = createResponse.body.id;
    expect(createdId).toBeDefined();

    const getResponse = await request(server)
      .get(`/reservations/${createdId}`)
      .expect(200);

    expect(getResponse.body).toHaveProperty('id', createdId);
    expect(getResponse.body).toHaveProperty(
      'passengerId',
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect(getResponse.body).toHaveProperty(
      'slotId',
      '550e8400-e29b-41d4-a716-446655440001',
    );
    expect(getResponse.body).toHaveProperty('status');
    expect(getResponse.body).toHaveProperty('date');
  });

  it('should return 400 when reservation is not found', async () => {
    await request(server)
      .get('/reservations/114f7271-1698-44c4-a8e8-e0414a6ced68')
      .expect(400);
  });

  it('should return 400 when reservation id is invalid', async () => {
    await request(server)
      .get('/reservations/00000000-0000-0000-0000-000000000000')
      .expect(400);
  });

  it('should return 400 for invalid UUID format', async () => {
    const response = await request(server)
      .get('/reservations/invalid-uuid')
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  it('should return 404 once reservation is deleted', async () => {
    const createResponse = await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440002',
        slotId: '550e8400-e29b-41d4-a716-446655440003',
      })
      .expect(201);

    const createdId = createResponse.body.id;

    await request(server).delete(`/reservations/${createdId}`).expect(204);

    await request(server).get(`/reservations/${createdId}`).expect(404);
  });
});
