import {BookingRepository} from "../../domain/entities/repositories/booking_repository.interface";
import {CreateBookingDto} from "../dto/create_booking_dto";
import {Booking} from "../../domain/entities/booking";
import {PropertyService} from "./property_service";
import {UserService} from "./user_service";
import {DateRange} from "../../domain/value_objects/date_range";
import {v4 as uuid} from "uuid";

export class BookingService {
    constructor(
        private bookingRepository: BookingRepository,
        private propertyService: PropertyService,
        private userService: UserService,
    ) {}
    async createBooking(dto: CreateBookingDto): Promise<Booking> {
        const property = await this.propertyService.findById(dto.propertyId);

        if(!property) {
            throw new Error("Propriedade não encontrada");
        }

        const user = await this.userService.findUserById(dto.guestId)

        if(!user) {
            throw new Error("Usuário não encontrado");
        }

        const dateRange = new DateRange(dto.startDate, dto.endDate);  //altamente acoplado, precisa de mock

        const booking = new Booking(
            uuid().toString(),
            property,
            user,
            dateRange,
            dto.guestCount
        );
        return this.bookingRepository.save(booking);
    }

    async cancelBooking(id: string): Promise<void> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new Error("Reserva não encontrada.")
        }

        booking.cancel(new Date())
        await this.bookingRepository.save(booking);
    }
}