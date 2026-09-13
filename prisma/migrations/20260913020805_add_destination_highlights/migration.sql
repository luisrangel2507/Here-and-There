-- CreateTable
CREATE TABLE "destination_highlights" (
    "dest_id" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_highlights_pkey" PRIMARY KEY ("dest_id")
);
