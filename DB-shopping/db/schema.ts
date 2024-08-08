import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
    integer,
    decimal,
  } from "drizzle-orm/pg-core";
  
  // export const ProductTable = pgTable("shopping", {
  //   id: uuid("id").primaryKey().defaultRandom(),
  //   todoText: varchar("todo_text", { length: 255 }).notNull(),
  //   isDone: boolean("is_done").default(false),
  //   createdAt: timestamp("created_at").defaultNow().notNull(),
  //   updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
  //     () => new Date()
  //   ),
  // });

  export const productTable = pgTable("Product", {
    P_id: uuid("P_id").primaryKey().defaultRandom(),
    P_name: varchar("P_name", { length: 255 }),
    P_description: text("P_description"),
    P_quantity: integer("P_quantity"),
    P_price: decimal("P_price", { precision: 10, scale: 2 }),
    CG_id: integer("CG_id").references(() => categoryTable.CG_id)
  });
  export const customerTable = pgTable("Customer", {
    C_id: integer("C_id").primaryKey(),
    C_name: varchar("C_name", { length: 255 }),
    C_password: varchar("C_password", { length: 255 }),
    C_email: varchar("C_email", { length: 255 }),
    C_gender: varchar("C_gender", { length: 10 }),
    C_age: integer("C_age")
  });
  
  export const orderTable = pgTable("Order", {
    O_id: integer("O_id").primaryKey(),
    Date_time: timestamp("Date_time"),
    Total: decimal("Total", { precision: 10, scale: 2 }),
    C_id: integer("C_id").references(() => customerTable.C_id),
    PM_id: integer("PM_id").references(() => paymentTable.PM_id)
  });
  
  export const orderDetailTable = pgTable("OrderDetail", {
    OD_id: integer("OD_id").primaryKey(),
    OD_quantity: integer("OD_quantity"),
    OD_price: decimal("OD_price", { precision: 10, scale: 2 }),
    P_id: integer("P_id").references(() => productTable.P_id),
    O_id: integer("O_id").references(() => orderTable.O_id)
  });
  
  export const paymentTable = pgTable("Payment", {
    PM_id: integer("PM_id").primaryKey(),
    PM_amount: decimal("PM_amount", { precision: 10, scale: 2 }),
    PM_type: varchar("PM_type", { length: 50 }),
    Date_time: timestamp("Date_time")
  });
  
  export const categoryTable = pgTable("Category", {
    CG_id: integer("CG_id").primaryKey(),
    CG_name: varchar("CG_name", { length: 255 })
  });
  
  export const rateTable = pgTable("Rate", {
    R_id: integer("R_id").primaryKey(),
    R_total: decimal("R_total", { precision: 10, scale: 2 }),
    R_createDate: timestamp("R_createDate"),
    P_id: integer("P_id").references(() => productTable.P_id)
  });
  
  export const commentTable = pgTable("Comment", {
    CM_id: integer("CM_id").primaryKey(),
    CM_text: text("CM_text"),
    CM_createDate: timestamp("CM_createDate"),
    P_id: integer("P_id").references(() => productTable.P_id)
  });

  