import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/reservations/infra/database/prisma/prisma.service';

describe('ConfirmReservationController (e2e)', () => {
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

  it('should confirm reservation successfully', async () => {
    const payload = {
      passengerId: '550e8400-e29b-41d4-a716-446655440220',
      slotId: '550e8400-e29b-41d4-a716-446655440221',
    };

    const createRes = await request(server)
      .post('/reservations')
      .send(payload)
      .expect(201);
    const id = createRes.body.id;

    const confirmRes = await request(server)
      .patch(`/reservations/${id}/confirm`)
      .expect(200);
    expect(confirmRes.body).toHaveProperty('id', id);

    const getRes = await request(server).get(`/reservations/${id}`).expect(200);
    expect(getRes.body).toHaveProperty('status', 'CONFIRMED');
  });

  it('should return 400 for invalid reservation ID', async () => {
    await request(server)
      .patch('/reservations/00000000-0000-0000-0000-000000000000/confirm')
      .expect(400);
  });

  it('should return 404 for non-existent reservation', async () => {
    await request(server)
      .patch('/reservations/00e6c395-9af3-451b-8e19-009ca9fcf8a2/confirm')
      .expect(404);
  });

  it('should return 409 when reservation already confirmed', async () => {
    const payload = {
      passengerId: '550e8400-e29b-41d4-a716-446655440230',
      slotId: '550e8400-e29b-41d4-a716-446655440231',
    };

    const createRes = await request(server)
      .post('/reservations')
      .send(payload)
      .expect(201);
    const id = createRes.body.id;

    await request(server).patch(`/reservations/${id}/confirm`).expect(200);
    await request(server).patch(`/reservations/${id}/confirm`).expect(409);
  });
});
