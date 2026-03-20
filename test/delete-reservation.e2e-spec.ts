import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/reservations/infra/database/prisma/prisma.service';

describe('DeleteReservationController (e2e)', () => {
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

  it('should delete an existing reservation successfully (204)', async () => {
    const createResponse = await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440100',
        slotId: '550e8400-e29b-41d4-a716-446655440101',
      })
      .expect(201);

    const reservationId = createResponse.body.id;

    await request(server).delete(`/reservations/${reservationId}`).expect(204);

    await request(server).get(`/reservations/${reservationId}`).expect(404);
  });

  it('should return 404 for nonexistent reservation', async () => {
    await request(server)
      .delete('/reservations/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('should return 400 for invalid UUID', async () => {
    const response = await request(server)
      .delete('/reservations/invalid-uuid')
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  it('should prevent deletion of completed or checked-in reservation if business rules apply', async () => {
    const createResponse = await request(server)
      .post('/reservations')
      .send({
        passengerId: '550e8400-e29b-41d4-a716-446655440110',
        slotId: '550e8400-e29b-41d4-a716-446655440111',
      })
      .expect(201);

    const id = createResponse.body.id;

    await request(server).patch(`/reservations/${id}/confirm`).expect(200);
    await request(server).patch(`/reservations/${id}/checkin`).expect(200);

    await request(server).delete(`/reservations/${id}`).expect(409);
  });
});
