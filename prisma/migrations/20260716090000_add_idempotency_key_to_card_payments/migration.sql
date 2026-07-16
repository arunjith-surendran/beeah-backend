-- AlterTable
ALTER TABLE "eoi_card_payments" ADD COLUMN "idempotency_key" TEXT;

-- AlterTable
ALTER TABLE "sales_booking_card_payments" ADD COLUMN "idempotency_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "eoi_card_payments_idempotency_key_key" ON "eoi_card_payments"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "sales_booking_card_payments_idempotency_key_key" ON "sales_booking_card_payments"("idempotency_key");
