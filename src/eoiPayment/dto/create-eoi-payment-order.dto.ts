import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

// Same constraint N-Genius enforces on merchantOrderReference, so a bad key
// is rejected here with a clear message instead of surfacing as a gateway 422.
const IDEMPOTENCY_KEY_PATTERN = /^[a-zA-Z0-9-]{1,37}$/;

export class CreateEoiPaymentOrderDto {
  @IsString()
  eoiId: string;

  // Major currency units (e.g. 100.50 AED), converted to minor units for N-Genius.
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  // Caller-supplied dedup key (e.g. a UUID generated once per checkout
  // attempt on the client). Re-sending the same key returns the existing
  // order instead of creating a second one - protects against double-tap
  // and network-retry double charges.
  @IsString()
  @Matches(IDEMPOTENCY_KEY_PATTERN, {
    message: 'idempotencyKey must be 1-37 chars, letters/digits/hyphens only',
  })
  idempotencyKey: string;
}
