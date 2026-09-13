-- CreateTable
CREATE TABLE "destination_costs" (
    "dest_id" TEXT NOT NULL,
    "costs" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_costs_pkey" PRIMARY KEY ("dest_id")
);
