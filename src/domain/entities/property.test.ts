import { Property } from "./property";
import { DateRange } from "./../value_objects/date_range";
import { Booking } from "./booking";
import { User } from "./user";

describe("Property Entity", () => {
  it("deve criar uma instância de Property com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa de praia",
      "Uma bela casa na praia",
      4,
      200,
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de praia");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("deve lançar erro se o nome for vazio", () => {
    expect(() => {
      new Property("1", "", "Descrição", 4, 200);
    }).toThrow("O nome é obrigatório");
  });

  it("deve lançar um erro se o número máximo de hóspedes for zero ou negativo", () => {
    expect(() => {
      new Property("1", "Nome", "Descrição", 0, 200);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");

    expect(() => {
      new Property("1", "Nome", "Descrição", -1, 200);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });

  it("deve validar o número máximo de hóspedes", () => {
    const property = new Property("1", "Nome", "Descrição", 5, 200);

    expect(() => {
      property.validateGuestCount(6);
    }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 5.");
  });

  it("não deve aplicar desconto para estadias menores que 7 noites", () => {
    const property = new Property("1", "Apartamento", "Descrição", 3, 100);
    const dateRange = new DateRange(
      new Date("2025-01-02"),
      new Date("2025-01-08"),
    );

    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(600);
  });

  it("deve aplicar o desconto para estadias maiores que 7 dias", () => {
    const property = new Property("1", "Casa", "Descrição", 4, 150);
    const dateRange = new DateRange(
      new Date("2025-02-02"),
      new Date("2025-02-12"),
    );

    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(1350);
  });

  it("deve verificar disponibilidade da propriedade", () => {
    const user = new User("1", "João Silva");
    const property = new Property("1", "Apartamento", "Descrição", 4, 150);
    const dateRange1 = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25"),
    );

    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27"),
    );

    new Booking("1", property, user, dateRange1, 2);
    expect(property.isAvailable(dateRange1)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});
