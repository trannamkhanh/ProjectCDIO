import express from "express";
import cors from "cors";
import { poolPromise } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   GET ALL BUYERS (ADMIN)
========================= */
app.get("/api/users", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        b.buyer_id,
        b.full_name,
        b.address,
        b.date_of_birth,
        b.created_at,
        a.account_id,
        a.email,
        a.phone,
        a.role,
        a.status
      FROM buyer b
      JOIN account a ON b.account_id = a.account_id
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Query failed:", err);
    res.status(500).json({ error: "Query failed" });
  }
});

/* =========================
   DELETE BUYER (ADMIN)
========================= */
app.delete("/api/users/:buyerId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { buyerId } = req.params;

    // Lấy account_id trước
    const accountResult = await pool
      .request()
      .input("buyerId", buyerId)
      .query(`
        SELECT account_id FROM buyer WHERE buyer_id = @buyerId
      `);

    if (accountResult.recordset.length === 0) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const accountId = accountResult.recordset[0].account_id;

    // Xóa buyer
    await pool
      .request()
      .input("buyerId", buyerId)
      .query(`DELETE FROM buyer WHERE buyer_id = @buyerId`);

    // Xóa account
    await pool
      .request()
      .input("accountId", accountId)
      .query(`DELETE FROM account WHERE account_id = @accountId`);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* =========================
   BLOCK / UNBLOCK USER
========================= */
app.patch("/api/users/:buyerId/block", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { buyerId } = req.params;

    await pool
      .request()
      .input("buyerId", buyerId)
      .query(`
        UPDATE account
        SET status = 'blocked'
        WHERE account_id = (
          SELECT account_id FROM buyer WHERE buyer_id = @buyerId
        )
      `);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Block failed:", err);
    res.status(500).json({ error: "Block failed" });
  }
});

/* =========================
   VERIFY USER (ADMIN)
========================= */
app.patch("/api/users/:buyerId/verify", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { buyerId } = req.params;

    await pool
      .request()
      .input("buyerId", buyerId)
      .query(`
        UPDATE account
        SET status = 'active'
        WHERE account_id = (
          SELECT account_id FROM buyer WHERE buyer_id = @buyerId
        )
      `);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Verify failed:", err);
    res.status(500).json({ error: "Verify failed" });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/api/auth/login", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password } = req.body;

    const result = await pool
      .request()
      .input("email", email)
      .input("password", password)
      .query(`
        SELECT 
          account_id,
          email,
          role,
          status
        FROM account
        WHERE email = @email AND password_hash = @password
      `);

    if (result.recordset.length === 0) {
      return res.json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const user = result.recordset[0];

    if (user.status !== "active") {
      return res.json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ Login failed:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
