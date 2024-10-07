/*
  Warnings:

  - The `O_status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DEFAULT', 'SUCCESS', 'ERROR');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "O_status",
ADD COLUMN     "O_status" "OrderStatus" NOT NULL DEFAULT 'DEFAULT';
