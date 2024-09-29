/*
  Warnings:

  - Added the required column `T_pnum` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "T_pnum" TEXT NOT NULL;
