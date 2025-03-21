import { RefundRuleFactory } from "../cacelation/refund_rule_factory";
import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly numberOfGuests: number;
  private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED";
  private totalPrice: number;

  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    numberOfGuests: number,
  ) {
    if (numberOfGuests <= 0) {
      throw new Error("O número de hóspedes deve ser maior que zero.");
    }
    property.validateGuestCount(numberOfGuests);

    if (!property.isAvailable(dateRange)) {
      throw new Error(
        "A propriedade não está disponível para o período selecionado.",
      );
    }

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.numberOfGuests = numberOfGuests;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = "CONFIRMED";

    property.addBooking(this);
  }

  cancel(currentDate: Date): void {
    if (this.status === "CANCELLED") {
      throw new Error("A reserva já foi cancelada.");
    }
    this.status = "CANCELLED";
    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysUntilChecking = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const refundRule = RefundRuleFactory.getRefundRule(daysUntilChecking);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getNumberOfGuests(): number {
    return this.numberOfGuests;
  }

  getStatus(): "CONFIRMED" | "CANCELLED" {
    return this.status;
  }
}
