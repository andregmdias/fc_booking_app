import {BookingRepository} from "../../domain/entities/repositories/booking_repository.interface";
import {Booking} from "../../domain/entities/booking";

export class FakeBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((user) => user.getId() === id) || null;
  }

  async save(booking: Booking): Promise<void> {
    this.bookings.push(booking);
  }
}
