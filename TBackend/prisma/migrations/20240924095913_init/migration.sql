-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "P_price" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Favourite" (
    "Fav_id" SERIAL NOT NULL,
    "C_id" INTEGER NOT NULL,
    "P_id" INTEGER NOT NULL,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("Fav_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_C_id_P_id_key" ON "Favourite"("C_id", "P_id");

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;
