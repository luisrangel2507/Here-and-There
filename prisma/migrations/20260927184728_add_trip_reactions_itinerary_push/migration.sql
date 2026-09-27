-- AlterTable
ALTER TABLE "app_state" ADD COLUMN     "trip_end" TEXT,
ADD COLUMN     "trip_start" TEXT;

-- CreateTable
CREATE TABLE "reactions" (
    "profile" TEXT NOT NULL,
    "dest_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("profile","dest_id","name")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "dest_id" TEXT NOT NULL,
    "days" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("dest_id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "endpoint" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("endpoint")
);

-- CreateTable
CREATE TABLE "push_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "public_key" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,

    CONSTRAINT "push_config_pkey" PRIMARY KEY ("id")
);

