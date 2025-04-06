import { CreateBookingDto } from "../dto/create_booking_dto";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/entities/repositories/booking_repository.interface";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { PropertyRepository } from "../../domain/entities/repositories/property_repository.interface";
import { UserRepository } from "../../domain/entities/repositories/user_repository.interface";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let fakeBookingRepository: BookingRepository;
  let bookingService: BookingService;

  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockPropertyRepository: jest.Mocked<PropertyRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    fakeBookingRepository = new FakeBookingRepository();

    mockPropertyRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<PropertyRepository>;

    mockUserRepository = {
      findUserById: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<UserRepository>;

    mockPropertyService = new PropertyService(mockPropertyRepository) as jest.Mocked<PropertyService>;
    mockPropertyService.findById = jest.fn();

    mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;
    mockUserService.findUserById = jest.fn();

    bookingService = new BookingService(fakeBookingRepository, mockPropertyService, mockUserService);
  });

  it("deve criar uma reserva com sucesso usando o repositorio fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    mockPropertyService.findById.mockResolvedValue(mockProperty);

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDto: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-20"),
      guestCount: 4,
    };

    const result = await bookingService.createBooking(bookingDto);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getTotalPrice()).toBe(500);
    expect(result.getStatus()).toBe("CONFIRMED");

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
  });

  it("deve lançar um excessão quando propriedade não for econtrada usando o repositorio fake", async () => {
    mockPropertyService.findById.mockResolvedValue(null);

    const bookingDto: CreateBookingDto = {
      propertyId: "10",
      guestId: "1",
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-20"),
      guestCount: 4,
    };

    await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
        "Propriedade não encontrada."
    );
  });

  it("deve lançar um erro quando usuário não for encontrado o repositorio fake", async () => {

    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    mockPropertyService.findById.mockResolvedValue(mockProperty);

    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDto: CreateBookingDto = {
      propertyId: "10",
      guestId: "1",
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-20"),
      guestCount: 4,
    };

    await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
        "Usuário não encontrado"
    );
  });

  it("deve lançar um erro ao tentar criar uma reserva para um período já reservado", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(false),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    mockPropertyService.findById.mockResolvedValue(mockProperty);

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDto: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-20"),
      guestCount: 4,
    };

    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() =>{
      throw new Error("A propriedade não está disponível para o período selecionado.")
    });

    await expect(bookingService.createBooking(bookingDto)).rejects.toThrow(
        "A propriedade não está disponível para o período selecionado."
    );
  });

  it("deve cancelar uma reserva usando o repositório fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    mockPropertyService.findById.mockResolvedValue(mockProperty);

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDto: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-10"),
      endDate: new Date("2024-12-20"),
      guestCount: 4,
    };

    const booking = await bookingService.createBooking(bookingDto);
    const spyFindById = jest.spyOn(fakeBookingRepository, "findById")
    await bookingService.cancelBooking(booking.getId());

    const cancelledBooking = await fakeBookingRepository.findById(booking.getId());
    expect(cancelledBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(2);
  });
});
