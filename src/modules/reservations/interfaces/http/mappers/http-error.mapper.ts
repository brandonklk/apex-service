import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

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

export class HttpErrorMapper {
  static toHttp(error: Error) {
    switch (error.constructor) {
      case SlotNotAvailableError:
      case ReservationImmutableError:
      case CancellationNotAllowedError:
      case InvalidReservationStatusTransitionError:
        return new ConflictException(error.message);

      case ReservationNotFoundError:
      case SlotNotFoundError:
      case PassengerNotFoundError:
        return new NotFoundException(error.message);

      case UnauthorizedActionError:
        return new ForbiddenException(error.message);

      case ReservationNotCreatedError:
      case ReservationError:
        return new InternalServerErrorException(error.message);

      case ReservationCheckInBeforeError:
        return new UnprocessableEntityException(error.message);

      default:
        return new InternalServerErrorException(error.message);
    }
  }
}
