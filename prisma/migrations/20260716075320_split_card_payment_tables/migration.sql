-- DropTable
DROP TABLE "payment_records";

-- CreateTable
CREATE TABLE "eoi_card_payments" (
    "id" TEXT NOT NULL,
    "eoi_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "order_reference" TEXT NOT NULL,
    "merchant_order_reference" TEXT NOT NULL,
    "gateway_response" JSONB,
    "salesforce_record_id" TEXT,
    "error_message" TEXT,
    "recorded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eoi_card_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_booking_card_payments" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "order_reference" TEXT NOT NULL,
    "merchant_order_reference" TEXT NOT NULL,
    "gateway_response" JSONB,
    "salesforce_record_id" TEXT,
    "error_message" TEXT,
    "recorded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_booking_card_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eoi_card_payments_order_reference_key" ON "eoi_card_payments"("order_reference");

-- CreateIndex
CREATE INDEX "eoi_card_payments_eoi_id_idx" ON "eoi_card_payments"("eoi_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_booking_card_payments_order_reference_key" ON "sales_booking_card_payments"("order_reference");

-- CreateIndex
CREATE INDEX "sales_booking_card_payments_booking_id_idx" ON "sales_booking_card_payments"("booking_id");

