-- -- CreateEnum
-- CREATE TYPE "OrderStatus" AS ENUM ('DEFAULT', 'SUCCESS', 'ERROR');

-- -- CreateTable
-- CREATE TABLE "Category" (
--     "CG_id" SERIAL NOT NULL,
--     "CG_name" VARCHAR(255) NOT NULL,

--     CONSTRAINT "Category_pkey" PRIMARY KEY ("CG_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Product" (
--     "P_id" SERIAL NOT NULL,
--     "P_name" VARCHAR(255) NOT NULL,
--     "P_description" TEXT,
--     "P_quantity" INTEGER NOT NULL,
--     "P_price" DECIMAL(65,30) NOT NULL,
--     "P_img" VARCHAR(1000),
--     "CG_id" INTEGER NOT NULL,

--     CONSTRAINT "Product_pkey" PRIMARY KEY ("P_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Customer" (
--     "C_id" SERIAL NOT NULL,
--     "C_name" VARCHAR(255),
--     "C_password" VARCHAR(255),
--     "C_email" VARCHAR(255) NOT NULL,
--     "C_gender" VARCHAR(10),
--     "C_age" INTEGER,
--     "T_pnum" VARCHAR(11),
--     "C_Role" BOOLEAN DEFAULT false,

--     CONSTRAINT "Customer_pkey" PRIMARY KEY ("C_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Order" (
--     "O_id" SERIAL NOT NULL,
--     "C_id" INTEGER NOT NULL,
--     "O_Date_time" TIMESTAMP(3) NOT NULL,
--     "O_Total" DECIMAL(65,30) NOT NULL,
--     "PM_id" INTEGER NOT NULL,
--     "A_id" INTEGER NOT NULL,
--     "O_Description" TEXT,
--     "O_status" "OrderStatus" NOT NULL DEFAULT 'DEFAULT',

--     CONSTRAINT "Order_pkey" PRIMARY KEY ("O_id")
-- );

-- -- CreateTable
-- CREATE TABLE "OrderDetail" (
--     "OD_id" SERIAL NOT NULL,
--     "O_id" INTEGER NOT NULL,
--     "P_id" INTEGER NOT NULL,
--     "OD_quantity" INTEGER NOT NULL,
--     "OD_price" DECIMAL(65,30) NOT NULL,

--     CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("OD_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Payment" (
--     "PM_id" SERIAL NOT NULL,
--     "PM_amount" DECIMAL(65,30) NOT NULL,
--     "PM_path" VARCHAR(100) NOT NULL,
--     "Date_time" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Payment_pkey" PRIMARY KEY ("PM_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Rate" (
--     "R_id" SERIAL NOT NULL,
--     "R_total" DECIMAL(65,30) NOT NULL,
--     "R_createDate" TIMESTAMP(3) NOT NULL,
--     "P_id" INTEGER NOT NULL,

--     CONSTRAINT "Rate_pkey" PRIMARY KEY ("R_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Comment" (
--     "CM_id" SERIAL NOT NULL,
--     "CM_text" TEXT NOT NULL,
--     "CM_createDate" TIMESTAMP(3) NOT NULL,
--     "P_id" INTEGER NOT NULL,

--     CONSTRAINT "Comment_pkey" PRIMARY KEY ("CM_id")
-- );

-- -- CreateTable
-- CREATE TABLE "CartDetail" (
--     "CA_id" SERIAL NOT NULL,
--     "C_id" INTEGER NOT NULL,
--     "P_id" INTEGER NOT NULL,
--     "CA_quantity" INTEGER NOT NULL,
--     "CA_price" DECIMAL(65,30) NOT NULL,

--     CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("CA_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Address" (
--     "A_id" SERIAL NOT NULL,
--     "C_id" INTEGER NOT NULL,
--     "A_name" VARCHAR(100) NOT NULL,
--     "A_phone" VARCHAR(11) NOT NULL,
--     "A_street" VARCHAR(255) NOT NULL,
--     "A_city" VARCHAR(100) NOT NULL,
--     "A_state" VARCHAR(100) NOT NULL,
--     "A_postalCode" VARCHAR(20) NOT NULL,
--     "A_country" VARCHAR(100) NOT NULL,

--     CONSTRAINT "Address_pkey" PRIMARY KEY ("A_id")
-- );

-- -- CreateTable
-- CREATE TABLE "Favourite" (
--     "Fav_id" SERIAL NOT NULL,
--     "C_id" INTEGER NOT NULL,
--     "P_id" INTEGER NOT NULL,

--     CONSTRAINT "Favourite_pkey" PRIMARY KEY ("Fav_id")
-- );

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Customer_C_email_key" ON "Customer"("C_email");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "CartDetail_C_id_P_id_key" ON "CartDetail"("C_id", "P_id");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Favourite_C_id_P_id_key" ON "Favourite"("C_id", "P_id");

-- -- AddForeignKey
-- ALTER TABLE "Product" ADD CONSTRAINT "Product_CG_id_fkey" FOREIGN KEY ("CG_id") REFERENCES "Category"("CG_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Order" ADD CONSTRAINT "Order_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Order" ADD CONSTRAINT "Order_PM_id_fkey" FOREIGN KEY ("PM_id") REFERENCES "Payment"("PM_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Order" ADD CONSTRAINT "Order_A_id_fkey" FOREIGN KEY ("A_id") REFERENCES "Address"("A_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_O_id_fkey" FOREIGN KEY ("O_id") REFERENCES "Order"("O_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Rate" ADD CONSTRAINT "Rate_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Comment" ADD CONSTRAINT "Comment_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Address" ADD CONSTRAINT "Address_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;
