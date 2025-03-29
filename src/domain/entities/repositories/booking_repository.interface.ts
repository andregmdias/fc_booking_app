import {Booking} from "../booking";

export interface BookingRepository {
    save(booking: Booking): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
}