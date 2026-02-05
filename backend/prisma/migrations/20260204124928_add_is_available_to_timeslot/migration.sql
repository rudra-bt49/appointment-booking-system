/*
  Warnings:

  - You are about to drop the column `isBooked` on the `TimeSlot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "isBooked",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
