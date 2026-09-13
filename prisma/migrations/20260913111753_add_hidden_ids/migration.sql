-- AlterTable
ALTER TABLE "app_state" ADD COLUMN     "hidden_ids" JSONB NOT NULL DEFAULT '[]';
