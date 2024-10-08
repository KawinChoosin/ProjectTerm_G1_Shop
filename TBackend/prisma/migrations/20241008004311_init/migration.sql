/*
  Warnings:

  - Added the required column `OD_product_name` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OD_product_price` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "OD_product_name" TEXT NOT NULL,
ADD COLUMN     "OD_product_price" DECIMAL(65,30) NOT NULL;
