/*
  Warnings:

  - You are about to drop the column `Date_time` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `Total` on the `Order` table. All the data in the column will be lost.
  - Added the required column `A_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `O_Total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Q_Date_time` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "Date_time",
DROP COLUMN "Total",
ADD COLUMN     "A_id" INTEGER NOT NULL,
ADD COLUMN     "O_Description" TEXT,
ADD COLUMN     "O_Total" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "Q_Date_time" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_A_id_fkey" FOREIGN KEY ("A_id") REFERENCES "Address"("A_id") ON DELETE RESTRICT ON UPDATE CASCADE;
