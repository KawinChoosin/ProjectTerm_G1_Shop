/*
  Warnings:

  - A unique constraint covering the columns `[C_email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_C_email_key" ON "Customer"("C_email");
