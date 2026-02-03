import { poolPromise } from "./db.js";

async function test() {
  try {
    const pool = await poolPromise;

    // Test connection
    const timeResult = await pool.request().query("SELECT GETDATE() as now");
    console.log("✅ DB Time:", timeResult.recordset);

    // Check account table
    const accountsResult = await pool
      .request()
      .query("SELECT account_id, email, role, status FROM account");
    console.log("\n📋 Accounts in database:");
    console.table(accountsResult.recordset);

    // Check buyer table
    const buyersResult = await pool.request().query("SELECT * FROM buyer");
    console.log("\n👥 Buyers in database:");
    console.table(buyersResult.recordset);
  } catch (err) {
    console.error("❌ DB error:", err.message);
    console.error("Full error:", err);
  } finally {
    process.exit();
  }
}

test();
