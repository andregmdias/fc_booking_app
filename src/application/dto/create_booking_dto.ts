export interface CreateBookingDto {
  propertyId: string;
  gestId: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
}
