-- CreateTable
CREATE TABLE "activity" (
    "id" SERIAL NOT NULL,
    "profile" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "dest_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_created_at_idx" ON "activity"("created_at");

