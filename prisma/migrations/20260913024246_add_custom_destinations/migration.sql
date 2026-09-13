-- CreateTable
CREATE TABLE "custom_destinations" (
    "region" TEXT NOT NULL,
    "destinations" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_destinations_pkey" PRIMARY KEY ("region")
);
