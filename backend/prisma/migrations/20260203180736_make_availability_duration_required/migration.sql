/*
  Warnings:

  - Made the column `endDuration` on table `DoctorAvailability` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDuration` on table `DoctorAvailability` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DoctorAvailability" ALTER COLUMN "endDuration" SET NOT NULL,
ALTER COLUMN "startDuration" SET NOT NULL;
