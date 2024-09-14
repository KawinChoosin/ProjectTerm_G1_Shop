-- CreateTable
CREATE TABLE "Product" (
    "P_id" TEXT NOT NULL,
    "P_name" TEXT NOT NULL,
    "P_description" TEXT,
    "P_quantity" INTEGER NOT NULL,
    "P_price" DECIMAL(65,30) NOT NULL,
    "P_img" TEXT,
    "CG_id" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("P_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "C_id" SERIAL NOT NULL,
    "C_name" TEXT NOT NULL,
    "C_password" TEXT NOT NULL,
    "C_email" TEXT NOT NULL,
    "C_gender" TEXT NOT NULL,
    "C_age" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("C_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "O_id" SERIAL NOT NULL,
    "Date_time" TIMESTAMP(3) NOT NULL,
    "Total" DECIMAL(65,30) NOT NULL,
    "C_id" INTEGER NOT NULL,
    "PM_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("O_id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "OD_id" SERIAL NOT NULL,
    "OD_quantity" INTEGER NOT NULL,
    "OD_price" DECIMAL(65,30) NOT NULL,
    "P_id" TEXT NOT NULL,
    "O_id" INTEGER NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("OD_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "PM_id" SERIAL NOT NULL,
    "PM_amount" DECIMAL(65,30) NOT NULL,
    "PM_type" TEXT NOT NULL,
    "Date_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("PM_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "CG_id" SERIAL NOT NULL,
    "CG_name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CG_id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "R_id" SERIAL NOT NULL,
    "R_total" DECIMAL(65,30) NOT NULL,
    "R_createDate" TIMESTAMP(3) NOT NULL,
    "P_id" TEXT NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("R_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "CM_id" SERIAL NOT NULL,
    "CM_text" TEXT NOT NULL,
    "CM_createDate" TIMESTAMP(3) NOT NULL,
    "P_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("CM_id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CG_id_fkey" FOREIGN KEY ("CG_id") REFERENCES "Category"("CG_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_C_id_fkey" FOREIGN KEY ("C_id") REFERENCES "Customer"("C_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_PM_id_fkey" FOREIGN KEY ("PM_id") REFERENCES "Payment"("PM_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_O_id_fkey" FOREIGN KEY ("O_id") REFERENCES "Order"("O_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_P_id_fkey" FOREIGN KEY ("P_id") REFERENCES "Product"("P_id") ON DELETE RESTRICT ON UPDATE CASCADE;
