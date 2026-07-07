-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "refreshToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "agency_id" TEXT,
ADD COLUMN     "agency_name" TEXT,
ADD COLUMN     "brn_id" TEXT,
ADD COLUMN     "commission_visibility" BOOLEAN DEFAULT true,
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN DEFAULT true,
ADD COLUMN     "is_admin" BOOLEAN DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "onboard_id" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

