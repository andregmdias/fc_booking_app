import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {PropertyEntity} from "./property_entity";
import {JoinColumn} from "typeorm";
import {UserEntity} from "./user_entity";


@Entity("bookings")
export class BookingEntity {

    @PrimaryColumn("uuid")
    id!: string;

    @Column({ type: "datetime", name: "start_date" })
    startDate!: Date;

    @Column({ type: "datetime", name: "end_date" })
    endDate!: Date;

    @Column({ name: "number_of_guests" })
    numberOfGuests!: number;

    @Column({ name: "total_price", type: "decimal" })
    totalPrice!: number;

    @Column()
    status!: "CONFIRMED" | "CANCELLED";

    @ManyToOne(() => PropertyEntity, (property) => property.bookings, { nullable: false })
    @JoinColumn({ name: "property_id" })
    property!: PropertyEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user!: UserEntity;

}