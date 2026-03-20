import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/reservations/infra/database/prisma/prisma.service';

describe('ListReservationController (e2e)', () => {
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

  it('should return empty list and valid pagination by default', async () => {
    const response = await request(server).get('/reservations').expect(200);

    expect(response.body).toEqual({
      data: [],
      pagination: expect.objectContaining({
        page: 1,
        size: 10,
        total: 0,
      }),
    });
  });

  it('should return results filtered by status', async () => {
    await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440010',
        slotId: '550e8400-e29b-41d4-a716-446655440011',
      })
      .expect(201);

    const response = await request(server)
      .get('/reservations')
      .query({ status: 'PENDING' })
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0]).toHaveProperty('status', 'PENDING');
  });

  it('should return results filtered by slotId', async () => {
    const slotId = '550e8400-e29b-41d4-a716-446655440020';

    await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440021',
        slotId,
      })
      .expect(201);

    const response = await request(server)
      .get('/reservations')
      .query({ slotId })
      .expect(200);

    expect(
      response.body.data.every((item: any) => item.slotId === slotId),
    ).toBe(true);
  });

  it('should return 400 for invalid page/size', async () => {
    await request(server)
      .get('/reservations')
      .query({ page: 0, size: 10 })
      .expect(400);

    await request(server)
      .get('/reservations')
      .query({ page: 1, size: 501 })
      .expect(400);
  });

  it('should return results filtered by date', async () => {
    const passengerId = '550e8400-e29b-41d4-a716-446655440030';
    const slotId = '550e8400-e29b-41d4-a716-446655440031';

    const created = await request(server)
      .post('/reservations')
      .send({ passengerId, slotId })
      .expect(201);

    const resDate = new Date(created.body.date).toISOString().split('T')[0];

    const response = await request(server)
      .get('/reservations')
      .query({ date: resDate })
      .expect(200);

    expect(
      response.body.data.some((item: any) => item.id === created.body.id),
    ).toBe(true);
  });
});
