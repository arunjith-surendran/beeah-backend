export class StatusCountDto {
  status: string;
  count: number;
}

export class DashboardDto {
  leads: StatusCountDto[];
  eoiDetails: StatusCountDto[];
  bookings: StatusCountDto[];
}
