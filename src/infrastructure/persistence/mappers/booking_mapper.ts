import {BookingEntity} from "../entities/booking_entity";
import {Booking} from "../../../domain/entities/booking";
import {Property} from "../../../domain/entities/property";
import {UserMapper} from "./user_mapper";
import {DateRange} from "../../../domain/value_objects/date_range";
import {PropertyMapper} from "./property_mapper";

export class BookingMapper {
    static fromEntity(entity: BookingEntity, property?: Property): Booking{
        const guest = UserMapper.fromEntity(entity.user);
        const dateRange = new DateRange(
            entity.startDate,
            entity.endDate
        )

        const booking = new Booking(
            entity.id,
            property || PropertyMapper.fromEntity(entity.property),
            guest,
            dateRange,
            entity.numberOfGuests
        )

        booking["totalPrice"] = Number(entity.totalPrice);
        booking["status"] = entity.status;

        return booking;
    }

    static fromModel(model: Booking): BookingEntity {
        const entity = new BookingEntity();
        entity.id = model.getId();
        entity.property = PropertyMapper.fromModel(model.getProperty());
        entity.user = UserMapper.fromModel(model.getGuest());
        entity.startDate = model.getDateRange().getStartDate();
        entity.endDate = model.getDateRange().getEndDate();
        entity.numberOfGuests = model.getGuestCount();
        entity.status = model.getStatus();
        entity["totalPrice"] = model.getTotalPrice();

        return entity;
    }
}