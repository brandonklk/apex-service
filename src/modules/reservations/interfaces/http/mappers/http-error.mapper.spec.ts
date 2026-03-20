import { HttpErrorMapper } from './http-error.mapper';

import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

// errors
import { SlotNotAvailableError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/slot-not-available.error';
import { ReservationImmutableError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/reservation-immutable.error';
import { CancellationNotAllowedError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/cancellation-not-allowed.error';
import { InvalidReservationStatusTransitionError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/invalid-reservation-status-transition.error';
import { ReservationNotFoundError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/reservation-not-found.error';
import { SlotNotFoundError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/slot-not-found.error';
import { PassengerNotFoundError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/passager-not-found.error';
import { UnauthorizedActionError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/unauthorized-action.error';
import { ReservationNotCreatedError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/reservation-not-created.error';
import { ReservationError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/reservation.error';
import { ReservationCheckInBeforeError } from '@/modules/reservations/domain/reservation/application/use-cases/errors/reservation-check-in-before.error';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('HttpErrorMapper', () => {
  const message = 'test error';

  it('should map conflict errors to ConflictException', () => {
    const errors = [
      new SlotNotAvailableError(),
      new ReservationImmutableError(),
      new CancellationNotAllowedError(),
      new InvalidReservationStatusTransitionError(
        ReservationStatus.CONFIRMED,
        ReservationStatus.CANCELLED,
      ),
    ];

    errors.forEach((error) => {
      const result = HttpErrorMapper.toHttp(error);
      expect(result).toBeInstanceOf(ConflictException);
      expect(result.message).toContain(error.message);
    });
  });

  it('should map not found errors to NotFoundException', () => {
    const errors = [
      new ReservationNotFoundError(message),
      new SlotNotFoundError(message),
      new PassengerNotFoundError(message),
    ];

    errors.forEach((error) => {
      const result = HttpErrorMapper.toHttp(error);
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.message).toContain(message);
    });
  });

  it('should map unauthorized error to ForbiddenException', () => {
    const error = new UnauthorizedActionError();

    const result = HttpErrorMapper.toHttp(error);

    expect(result).toBeInstanceOf(ForbiddenException);
    expect(result.message).toContain(
      'User is not allowed to perform this action',
    );
  });

  it('should map internal errors to InternalServerErrorException', () => {
    const errors = [new ReservationNotCreatedError(), new ReservationError()];

    errors.forEach((error) => {
      const result = HttpErrorMapper.toHttp(error);
      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toContain(error.message);
    });
  });

  it('should map check-in error to UnprocessableEntityException', () => {
    const error = new ReservationCheckInBeforeError();

    const result = HttpErrorMapper.toHttp(error);

    expect(result).toBeInstanceOf(UnprocessableEntityException);
    expect(result.message).toContain(
      'Check-in before the scheduled time is not permitted.',
    );
  });

  it('should fallback to InternalServerErrorException for unknown errors', () => {
    const error = new Error(message);

    const result = HttpErrorMapper.toHttp(error);

    expect(result).toBeInstanceOf(InternalServerErrorException);
    expect(result.message).toContain(message);
  });
});
