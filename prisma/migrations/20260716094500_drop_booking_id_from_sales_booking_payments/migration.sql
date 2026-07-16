-- DropIndex
DROP INDEX "sales_booking_card_payments_booking_id_idx";

-- AlterTable
ALTER TABLE "sales_booking_card_payments" DROP COLUMN "booking_id";
