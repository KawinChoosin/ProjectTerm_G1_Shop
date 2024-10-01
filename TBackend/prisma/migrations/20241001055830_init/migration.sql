/*
  Warnings:

  - You are about to drop the column `PM_type` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `PM_path` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "T_pnum" SET DATA TYPE VARCHAR(11);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "PM_type",
ADD COLUMN     "PM_path" VARCHAR(100) NOT NULL;
