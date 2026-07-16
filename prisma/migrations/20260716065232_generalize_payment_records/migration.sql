-- DropTable
DROP TABLE "payment_orders";

-- CreateTable
CREATE TABLE "payment_records" (
    "id" TEXT NOT NULL,
    "eoi_id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "order_reference" TEXT,
    "merchant_order_reference" TEXT,
    "gateway_response" JSONB,
    "bank_name" TEXT,
    "transaction_date" TEXT,
    "transaction_no" TEXT,
    "cheque_number" TEXT,
    "cheque_date" TEXT,
    "third_party_cheque" TEXT,
    "salesforce_record_id" TEXT,
    "error_message" TEXT,
    "recorded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_order_reference_key" ON "payment_records"("order_reference");

