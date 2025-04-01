import {Repository} from "typeorm";
import {BookingRepository} from "../../domain/entities/repositories/booking_repository.interface";
import {Booking} from "../../domain/entities/booking";
import {BookingEntity} from "../persistence/entities/booking_entity";
import {BookingMapper} from "../persistence/mappers/booking_mapper";

export class TypeORMBookingRepository implements BookingRepository {
    private readonly repository: Repository<BookingEntity>;

    constructor(repository: Repository<BookingEntity>) {
        this.repository = repository;
    }

    async save(booking: Booking): Promise<void> {
        const entity = BookingMapper.fromModel(booking);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<Booking | null> {
        const fetched = await this.repository.findOne({
            where: { id },
            relations: ["property", "user"]
        });

        return fetched ? BookingMapper.fromEntity(fetched) : null;
    }

}