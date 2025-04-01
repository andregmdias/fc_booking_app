import { Column, Entity, PrimaryColumn } from "typeorm";

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

  // @Column()
  // bookings: Booking[] = [];

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
