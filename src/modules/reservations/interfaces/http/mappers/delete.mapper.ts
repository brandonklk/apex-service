export class DeleteReservationMapper {
  static toInput(id: string): any {
    return {
      id,
    };
  }
}
