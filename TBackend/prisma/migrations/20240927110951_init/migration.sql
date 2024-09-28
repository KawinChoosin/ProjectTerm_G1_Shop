/*
  Warnings:

  - You are about to alter the column `CA_price` on the `CartDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "CartDetail" ALTER COLUMN "CA_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "Total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "OrderDetail" ALTER COLUMN "OD_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "PM_amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Rate" ALTER COLUMN "R_total" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Address" (
    "A_id" SERIAL NOT NULL,
    "C_id" INTEGER NOT NULL,
    "A_street" VARCHAR(255) NOT NULL,
    "A_city" VARCHAR(100) NOT NULL,
    "A_state" VARCHAR(100) NOT NULL,
    "A_postalCode" VARCHAR(20) NOT NULL,
    "A_country" VARCHAR(100) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("A_id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;
