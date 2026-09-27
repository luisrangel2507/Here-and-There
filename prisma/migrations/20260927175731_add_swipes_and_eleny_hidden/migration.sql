-- AlterTable
ALTER TABLE "app_state" ADD COLUMN     "eleny_hidden_ids" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "swipes" (
    "profile" TEXT NOT NULL,
    "dest_id" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swipes_pkey" PRIMARY KEY ("profile","dest_id")
);

