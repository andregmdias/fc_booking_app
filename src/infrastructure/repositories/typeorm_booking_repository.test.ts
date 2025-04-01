import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import {BookingEntity} from "../persistence/entities/booking_entity";
import {User} from "../../domain/entities/user";
import {DateRange} from "../../domain/value_objects/date_range";
import {Booking} from "../../domain/entities/booking";
import {TypeORMBookingRepository} from "./typeorm_booking_repository";

describe("TypeORMBookingRepository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;
  let repository: Repository<BookingEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [BookingEntity, PropertyEntity, UserEntity],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    repository = dataSource.getRepository(BookingEntity);
    bookingRepository = new TypeORMBookingRepository(repository);
  });

  afterAll(() => {
    dataSource.destroy();
  });

  it("deve salvar uma reserva com sucesso", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "Casa na praia",
      description: "Vista para o mar",
      maxGuests: 6,
      basePricePerNight: 200,

    });
    await propertyRepository.save(propertyEntity);

    const userEntity = userRepository.create({
      id: "1",
      name: "John Doe"
    });
    await userRepository.save(userEntity);


    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
        new Date("2024-12-20"),
        new Date("2025-01-25"),
    );
    const property = new Property(
        "1",
        "Casa na praia",
        "Vista para o mar",
        6,
        200
    );
    const booking = new Booking(
        "1",
        property,
        user,
        dateRange,
        6
    );

    await bookingRepository.save(booking);

    await bookingRepository.save(booking);

    const fetchBooking = await bookingRepository.findById("1")

    expect(fetchBooking).not.toBeNull();
    expect(fetchBooking?.getId()).toEqual("1");
    expect(fetchBooking?.getProperty().getId()).toEqual("1");
    expect(fetchBooking?.getNumberOfGuests()).toEqual(6);
    expect(fetchBooking?.getUser().getId()).toEqual("1");
  });
});
