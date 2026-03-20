export class PassengerNotFoundError extends Error {
  constructor(public readonly passengerId: string) {
    super(`Passenger ${passengerId} not found`);
    this.name = 'PassengerNotFoundError';
  }
}
