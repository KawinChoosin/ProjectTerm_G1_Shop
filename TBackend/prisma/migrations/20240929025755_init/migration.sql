/*
  Warnings:

  - You are about to alter the column `T_pnum` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "T_pnum" SET DATA TYPE VARCHAR(10);
