import { DateRange } from "./date_range";

describe("DateRange Value Object", () => {
  it("deve criar uma instância de DateRange com a data de início e a data de término", () => {
    const startDate = new Date("2025-12-25");
    const endDate = new Date("2025-12-30");
    const dateRange = new DateRange(startDate, endDate);

    expect(dateRange).toBeInstanceOf(DateRange);
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it("deve lançar um erro se a data de término for antes da data de início", () => {
    expect(() => {
      new DateRange(new Date("2025-12-25"), new Date("2025-12-20"));
    }).toThrow("A data de término deve ser posterior à data de início.");
  });

  it("deve calcular o total de noites corretamente", () => {
    const startDate = new Date("2025-12-25");
    const endDate = new Date("2025-12-30");
    const dateRange = new DateRange(startDate, endDate);

    const totalNights = dateRange.getTotalNights();

    expect(totalNights).toBe(5);

    const startDate2 = new Date("2025-12-10");
    const endDate2 = new Date("2025-12-25");
    const dateRange2 = new DateRange(startDate2, endDate2);

    const totalNights2 = dateRange2.getTotalNights();

    expect(totalNights2).toBe(15);
  });

  it("deve verificar se dois intervalos de datas se sobrepõe", () => {
    const dateRange1 = new DateRange(
      new Date("2025-12-20"),
      new Date("2025-12-25"),
    );
    const dateRange2 = new DateRange(
      new Date("2025-12-22"),
      new Date("2025-12-27"),
    );

    const overlaps = dateRange1.overlaps(dateRange2);

    expect(overlaps).toBe(true);
  });

  it("deve lançar erro se a data de início e término forem iguais", () => {
    const date = new Date("2025-12-25");
    expect(() => {
      new DateRange(date, date);
    }).toThrow("A data de início e a data término não podem ser iguais.");
  });
});
