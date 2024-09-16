/*
  Warnings:

  - The primary key for the `CartDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[C_id,P_id]` on the table `CartDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE cartdetail_ca_id_seq;
ALTER TABLE "CartDetail" DROP CONSTRAINT "CartDetail_pkey",
ALTER COLUMN "CA_id" SET DEFAULT nextval('cartdetail_ca_id_seq'),
ALTER COLUMN "CA_price" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("CA_id");
ALTER SEQUENCE cartdetail_ca_id_seq OWNED BY "CartDetail"."CA_id";

-- CreateIndex
CREATE UNIQUE INDEX "CartDetail_C_id_P_id_key" ON "CartDetail"("C_id", "P_id");
