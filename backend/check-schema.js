import { poolPromise } from "./db.js";

async function checkSchema() {
  try {
    const pool = await poolPromise;

    const accountResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'account'
      ORDER BY ORDINAL_POSITION
    `);
    console.log("📋 Account table schema:");
    console.table(accountResult.recordset);

    const sellerResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'seller'
      ORDER BY ORDINAL_POSITION
    `);
    console.log("\n🏪 Seller table schema:");
    console.table(sellerResult.recordset);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit();
  }
}

checkSchema();
