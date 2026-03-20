import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/modules/reservations/infra/database/prisma/prisma.service';

describe('CreateReservationController (e2e)', () => {
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

  it('should create reservation and return 201 + id', async () => {
    const payload = {
      passengerId: '550e8400-e29b-41d4-a716-446655440200',
      slotId: '550e8400-e29b-41d4-a716-446655440201',
    };

    const res = await request(server)
      .post('/reservations')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      passengerId: payload.passengerId,
      slotId: payload.slotId,
      status: 'PENDING',
    });
  });

  it('should return 400 when payload invalid', async () => {
    await request(server)
      .post('/reservations')
      .send({ passengerId: 'invalid', slotId: 'invalid' })
      .expect(400);
  });

  it('should return 409 when slot is already booked for same passenger/date', async () => {
    const payload = {
      passengerId: '550e8400-e29b-41d4-a716-446655440210',
      slotId: '550e8400-e29b-41d4-a716-446655440211',
    };

    await request(server).post('/reservations').send(payload).expect(201);
    await request(server).post('/reservations').send(payload).expect(409);
  });
});
