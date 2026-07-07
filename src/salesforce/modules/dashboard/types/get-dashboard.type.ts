export interface GetDashboardApexPayload {
  userId: string;
  timeLineinDays: string;
}

export interface DashboardStatusCount {
  Status: string;
  count: number;
}

export interface GetDashboardApexResponse {
  Status: string;
  message: string;
  leads: DashboardStatusCount[];
  eoiDetail: DashboardStatusCount[];
  bookings: DashboardStatusCount[];
}
