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
