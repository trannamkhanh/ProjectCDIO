import { poolPromise } from "./db.js";

async function test() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT GETDATE() as now");

    console.log(result.recordset);
  } catch (err) {
    console.error("DB error:", err);
  }
}

test();
