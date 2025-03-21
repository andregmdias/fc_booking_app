import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

describe("Booking Entity", () => {
  it("deve criar uma instância de Booking com todos os atributos", () => {
    const property = new Property("1", "Apartamento", "Descrição", 3, 100);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25"),
    );

    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getNumberOfGuests()).toBe(2);
  });

  it("deve lançar um erro se o número de hóspedes for menor ou igual zero", () => {
    const property = new Property("1", "Apartamento", "Descrição", 3, 100);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25"),
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 0);
    }).toThrow("O número de hóspedes deve ser maior que zero.");

    expect(() => {
      new Booking("1", property, user, dateRange, -1);
    }).toThrow("O número de hóspedes deve ser maior que zero.");
  });

  it("deve lançar um erro ao tentar criar uma reserva com o número de hóspedes acima do permitido", () => {
    const property = new Property("1", "Apartamento", "Descrição", 3, 100);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25"),
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 5);
    }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 3.");
  });

  it("deve calcular o preço total com desconto", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-28"),
    );

    const booking = new Booking("1", property, user, dateRange, 4);

    expect(booking.getTotalPrice()).toBe(300 * 8 * 0.9);
  });

  it("nao deve realizar o agendamento, quando uma propriedade não estiver disponível", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-01"),
      new Date("2024-12-10"),
    );

    new Booking("1", property, user, dateRange, 4);

    const dateRange2 = new DateRange(
      new Date("2024-12-02"),
      new Date("2024-12-09"),
    );

    expect(() => {
      new Booking("2", property, user, dateRange2, 4);
    }).toThrow("A propriedade não está disponível para o período selecionado.");
  });
  it("deve cancelar uma reserva sem reembolso quano a data for superior a ", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-01"),
      new Date("2024-12-10"),
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-01");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9);
  });

  it("deve cancelar uma reserva com reembolso total quando a data for superior a 7 dias do check-in", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-20"),
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-01");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 a 7 dias do check-in", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-20"),
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-05");
    booking.cancel(currentDate);

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.5);
  });

  it("não deve permitir o cancelamento de uma reserva já cancelada", () => {
    const property = new Property("1", "Apartamento", "Descrição", 5, 300);
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-20"),
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2024-12-05");
    booking.cancel(currentDate);

    expect(() => {
      booking.cancel(currentDate);
    }).toThrow("A reserva já foi cancelada.");
  });
});
