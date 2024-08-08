CREATE TABLE IF NOT EXISTS "Category" (
	"CG_id" integer PRIMARY KEY NOT NULL,
	"CG_name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Comment" (
	"CM_id" integer PRIMARY KEY NOT NULL,
	"CM_text" text,
	"CM_createDate" timestamp,
	"P_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer" (
	"C_id" integer PRIMARY KEY NOT NULL,
	"C_name" varchar(255),
	"C_password" varchar(255),
	"C_email" varchar(255),
	"C_gender" varchar(10),
	"C_age" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrderDetail" (
	"OD_id" integer PRIMARY KEY NOT NULL,
	"OD_quantity" integer,
	"OD_price" numeric(10, 2),
	"P_id" uuid,
	"O_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Order" (
	"O_id" integer PRIMARY KEY NOT NULL,
	"Date_time" timestamp,
	"Total" numeric(10, 2),
	"C_id" integer,
	"PM_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Payment" (
	"PM_id" integer PRIMARY KEY NOT NULL,
	"PM_amount" numeric(10, 2),
	"PM_type" varchar(50),
	"Date_time" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Product" (
	"P_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"P_name" varchar(255),
	"P_description" text,
	"P_quantity" integer,
	"P_price" numeric(10, 2),
	"CG_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Rate" (
	"R_id" integer PRIMARY KEY NOT NULL,
	"R_total" numeric(10, 2),
	"R_createDate" timestamp,
	"P_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_P_id_Product_P_id_fk" FOREIGN KEY ("P_id") REFERENCES "public"."Product"("P_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_P_id_Product_P_id_fk" FOREIGN KEY ("P_id") REFERENCES "public"."Product"("P_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_O_id_Order_O_id_fk" FOREIGN KEY ("O_id") REFERENCES "public"."Order"("O_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order" ADD CONSTRAINT "Order_C_id_Customer_C_id_fk" FOREIGN KEY ("C_id") REFERENCES "public"."Customer"("C_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order" ADD CONSTRAINT "Order_PM_id_Payment_PM_id_fk" FOREIGN KEY ("PM_id") REFERENCES "public"."Payment"("PM_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Product" ADD CONSTRAINT "Product_CG_id_Category_CG_id_fk" FOREIGN KEY ("CG_id") REFERENCES "public"."Category"("CG_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Rate" ADD CONSTRAINT "Rate_P_id_Product_P_id_fk" FOREIGN KEY ("P_id") REFERENCES "public"."Product"("P_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
