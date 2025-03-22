import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  private readonly id: String;
  private readonly name: String;
  private readonly description: String;
  private readonly maxGuests: number;
  private readonly basePricePerNight: number;
  private readonly bookings: Booking[] = [];

  constructor(
    id: string,
    name: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number,
  ) {
    if (!name) {
      throw new Error("O nome é obrigatório");
    }

    if (maxGuests <= 0) {
      throw new Error("O número máximo de hóspedes deve ser maior que zero");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new Error(
        `Número máximo de hóspedes excedido. Máximo permitido: ${this.maxGuests}.`,
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    const totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      return totalPrice * 0.9;
    }
    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange),
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }

  getId(): String {
    return this.id;
  }

  getName(): String {
    return this.name;
  }

  getDescription(): String {
    return this.description;
  }

  getMaxGuests(): Number {
    return this.maxGuests;
  }

  getBasePricePerNight(): Number {
    return this.basePricePerNight;
  }

  getBookings(): Booking[] {
    return { ...this.bookings };
  }
}
