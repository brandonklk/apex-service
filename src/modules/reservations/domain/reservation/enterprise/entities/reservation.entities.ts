import { Either, left, right } from '@/core/either/either';
import { CancellationNotAllowedError } from '../../application/use-cases/errors/cancellation-not-allowed.error';
import { InvalidReservationStatusTransitionError } from '../../application/use-cases/errors/invalid-reservation-status-transition.error';
import { ReservationCheckInBeforeError } from '../../application/use-cases/errors/reservation-check-in-before.error';
import { ReservationImmutableError } from '../../application/use-cases/errors/reservation-immutable.error';
import { ReservationStatus } from '../enums/reservation-status';

type ReservationDomainError =
  | ReservationImmutableError
  | InvalidReservationStatusTransitionError
  | ReservationCheckInBeforeError
  | CancellationNotAllowedError;

type DomainResponse = Either<ReservationDomainError, void>;

export class Reservation {
  private constructor(
    public readonly id: string,
    public readonly slotId: string,
    public readonly passengerId: string,
    public date: Date,
    private _status: ReservationStatus,
  ) {}

  static build(props: {
    id: string;
    slotId: string;
    passengerId: string;
    date: Date;
    status: ReservationStatus;
  }) {
    return new Reservation(
      props.id,
      props.slotId,
      props.passengerId,
      props.date,
      props.status,
    );
  }

  static create(props: {
    id: string;
    slotId: string;
    passengerId: string;
    date: Date;
  }) {
    return new Reservation(
      props.id,
      props.slotId,
      props.passengerId,
      props.date,
      ReservationStatus.PENDING,
    );
  }

  get status() {
    return this._status;
  }

  private ensureMutable(): Either<ReservationImmutableError, void> {
    const isImmutable = [
      ReservationStatus.COMPLETED,
      ReservationStatus.CANCELLED,
    ].includes(this.status);

    if (isImmutable) {
      return left(new ReservationImmutableError());
    }

    return right(undefined);
  }

  confirm(): DomainResponse {
    const mutable = this.ensureMutable();
    if (mutable.isLeft()) return mutable;

    if (this.status !== ReservationStatus.PENDING) {
      return left(
        new InvalidReservationStatusTransitionError(
          this.status,
          ReservationStatus.CONFIRMED,
        ),
      );
    }

    this._status = ReservationStatus.CONFIRMED;
    return right(undefined);
  }

  checkIn(): DomainResponse {
    const mutable = this.ensureMutable();
    if (mutable.isLeft()) return mutable;

    if (this.status !== ReservationStatus.CONFIRMED) {
      return left(
        new InvalidReservationStatusTransitionError(
          this.status,
          ReservationStatus.CHECKED_IN,
        ),
      );
    }

    const isAfterCheckInTime = new Date() >= this.date;

    if (!isAfterCheckInTime) {
      return left(new ReservationCheckInBeforeError());
    }

    this._status = ReservationStatus.CHECKED_IN;
    return right(undefined);
  }

  complete(): DomainResponse {
    const mutable = this.ensureMutable();
    if (mutable.isLeft()) return mutable;

    if (this.status !== ReservationStatus.CHECKED_IN) {
      return left(
        new InvalidReservationStatusTransitionError(
          this.status,
          ReservationStatus.COMPLETED,
        ),
      );
    }

    this._status = ReservationStatus.COMPLETED;
    return right(undefined);
  }

  cancel(now: Date): DomainResponse {
    const mutable = this.ensureMutable();
    if (mutable.isLeft()) return mutable;

    if (this.status === ReservationStatus.CHECKED_IN) {
      return left(
        new InvalidReservationStatusTransitionError(
          this.status,
          ReservationStatus.CANCELLED,
        ),
      );
    }

    const diffInMs = this.date.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 4) {
      return left(new CancellationNotAllowedError());
    }

    this._status = ReservationStatus.CANCELLED;
    return right(undefined);
  }
}
