/*
  Warnings:

  - Added the required column `A_name` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `A_phone` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "A_name" TEXT NOT NULL,
ADD COLUMN     "A_phone" TEXT NOT NULL;
