import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {BookingEntity} from "./booking_entity";
import {Booking} from "../../../domain/entities/booking";

@Entity("properties")
export class PropertyEntity {
  constructor(
    id: string,
    name: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ name: "max_guests" })
  maxGuests!: number;

  @Column({ name: "base_price_per_night", type: "decimal" })
  basePricePerNight!: number;

  @OneToMany(() => BookingEntity, (booking) => booking.property)
  bookings!: BookingEntity[];

  getId(): string {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight() {
    return this.basePricePerNight;
  }
}
