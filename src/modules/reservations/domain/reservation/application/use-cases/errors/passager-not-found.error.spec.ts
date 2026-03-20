import { PassengerNotFoundError } from './passager-not-found.error';

describe('PassengerNotFoundError', () => {
  it('should create an error with correct message and name', () => {
    const passengerId = '123';
    const error = new PassengerNotFoundError(passengerId);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('PassengerNotFoundError');
    expect(error.message).toBe(`Passenger ${passengerId} not found`);
    expect(error.passengerId).toBe(passengerId);
  });
});