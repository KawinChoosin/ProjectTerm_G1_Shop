import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client";
import { categoryTable, productTable } from "@db/schema";

async function insertData() {
  await dbClient.insert(categoryTable).values({
    CG_id: 1,
    CG_name: "test",
  });
  await dbClient.insert(productTable).values({
    P_name: "Bike",
    P_description: "greeen bikke",
    P_quantity: 1,
    P_price: "1",
    CG_id: 1,
  });
  dbConn.end();
}

async function deleteData() {
  const resultsP = await dbClient.query.productTable.findMany();
  const resultsC = await dbClient.query.categoryTable.findMany();
  if (resultsP.length && resultsC.length === 0) dbConn.end();
  const Pid = resultsP[0].P_id;
  const Cid = resultsC[0].CG_id;
  await dbClient.delete(productTable).where(eq(productTable.P_id, Pid));
  await dbClient.delete(categoryTable).where(eq(categoryTable.CG_id, Cid));
  dbConn.end();
}

// insertData();
deleteData();
