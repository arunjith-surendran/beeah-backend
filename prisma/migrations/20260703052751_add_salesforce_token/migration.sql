-- CreateTable
CREATE TABLE "salesforce_tokens" (
    "id" TEXT NOT NULL DEFAULT 'salesforce',
    "accessToken" TEXT NOT NULL,
    "instanceUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salesforce_tokens_pkey" PRIMARY KEY ("id")
);
