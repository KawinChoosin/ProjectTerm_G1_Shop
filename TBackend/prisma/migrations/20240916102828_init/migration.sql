/*
  Warnings:

  - You are about to alter the column `CG_name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `C_name` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `C_password` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `C_email` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `C_gender` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `Total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `OD_price` on the `OrderDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `PM_amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `PM_type` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `P_id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `P_name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `P_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `P_img` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `R_total` on the `Rate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Changed the type of `P_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `P_id` on the `OrderDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `P_id` on the `Rate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_P_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_P_id_fkey";

-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_P_id_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "CG_name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "P_id",
ADD COLUMN     "P_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "C_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "C_password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "C_email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "C_gender" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "Total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "OrderDetail" ALTER COLUMN "OD_price" SET DATA TYPE INTEGER,
DROP COLUMN "P_id",
ADD COLUMN     "P_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "PM_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "PM_type" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "P_id",
ADD COLUMN     "P_id" SERIAL NOT NULL,
ALTER COLUMN "P_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "P_price" SET DATA TYPE INTEGER,
ALTER COLUMN "P_img" SET DATA TYPE VARCHAR(1000),
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("P_id");

-- AlterTable
ALTER TABLE "Rate" ALTER COLUMN "R_total" SET DATA TYPE INTEGER,
DROP COLUMN "P_id",
ADD COLUMN     "P_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CartDetail" (
    "CA_id" INTEGER NOT NULL,
    "C_id" INTEGER NOT NULL,
    "P_id" INTEGER NOT NULL,
    "CA_quantity" INTEGER NOT NULL,
    "CA_price" INTEGER NOT NULL,

    CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("C_id","P_id")
);

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;
