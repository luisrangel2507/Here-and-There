-- CreateTable
CREATE TABLE "destination_lodging" (
    "dest_id" TEXT NOT NULL,
    "lodging" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_lodging_pkey" PRIMARY KEY ("dest_id")
);
