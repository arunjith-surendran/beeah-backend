export interface CreateGatewayOrderRequest {
  // Short, human-readable tag used to build the merchantOrderReference sent
  // to N-Genius (e.g. 'EOI', 'SALES_BOOKING') - purely for traceability on
  // N-Genius's own dashboard, not used for anything on our side.
  merchantReferenceTag: string;
  entityId: string;
  // Major currency units (e.g. 100.50 AED) - converted to minor units for N-Genius internally.
  amount: number;
  currency?: string;
}
