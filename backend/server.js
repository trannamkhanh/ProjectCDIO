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
    const accountResult = await pool.request().input("buyerId", buyerId).query(`
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

    await pool.request().input("buyerId", buyerId).query(`
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

    await pool.request().input("buyerId", buyerId).query(`
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
   REGISTER
========================= */
app.post("/api/auth/register", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { name, email, password, phone, address, role, storeName } = req.body;

    console.log("📝 Register attempt:", { name, email, role });

    // Check if email already exists
    const checkEmail = await pool
      .request()
      .input("email", email)
      .query("SELECT account_id FROM account WHERE email = @email");

    if (checkEmail.recordset.length > 0) {
      console.log("❌ Email already exists");
      return res.json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    // Insert into account table (username = email before @)
    const username = email.split("@")[0];
    const accountResult = await pool
      .request()
      .input("username", username)
      .input("email", email)
      .input("password", password)
      .input("phone", phone)
      .input("role", role).query(`
        INSERT INTO account (username, email, password_hash, phone, role, status)
        OUTPUT INSERTED.account_id
        VALUES (@username, @email, @password, @phone, @role, 'active')
      `);

    const accountId = accountResult.recordset[0].account_id;
    console.log("✅ Account created:", accountId);

    // Insert into buyer or seller table
    if (role === "buyer") {
      await pool
        .request()
        .input("accountId", accountId)
        .input("fullName", name)
        .input("address", address).query(`
          INSERT INTO buyer (account_id, full_name, address)
          VALUES (@accountId, @fullName, @address)
        `);
      console.log("✅ Buyer profile created");
    } else if (role === "seller") {
      await pool
        .request()
        .input("accountId", accountId)
        .input("shopName", storeName)
        .input("shopAddress", address).query(`
          INSERT INTO seller (account_id, shop_name, shop_address)
          VALUES (@accountId, @shopName, @shopAddress)
        `);
      console.log("✅ Seller profile created");
    }

    res.json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (err) {
    console.error("❌ Register failed:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      success: false,
      message: "Đăng ký thất bại",
      details: err.message,
    });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/api/auth/login", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", { email, password });

    const result = await pool
      .request()
      .input("email", email)
      .input("password", password).query(`
        SELECT 
          account_id,
          email,
          role,
          status
        FROM account
        WHERE email = @email AND password_hash = @password
      `);

    console.log("📊 Query result:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("❌ No user found");
      return res.json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const user = result.recordset[0];

    if (user.status !== "active") {
      console.log("❌ User blocked");
      return res.json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    // Get additional info based on role
    let additionalInfo = {};
    if (user.role === "seller") {
      const sellerResult = await pool
        .request()
        .input("accountId", user.account_id).query(`
          SELECT seller_id, shop_name, shop_address
          FROM seller
          WHERE account_id = @accountId
        `);
      if (sellerResult.recordset.length > 0) {
        additionalInfo = sellerResult.recordset[0];
      }
    } else if (user.role === "buyer") {
      const buyerResult = await pool
        .request()
        .input("accountId", user.account_id).query(`
          SELECT buyer_id, full_name, address
          FROM buyer
          WHERE account_id = @accountId
        `);
      if (buyerResult.recordset.length > 0) {
        additionalInfo = buyerResult.recordset[0];
      }
    }

    const userWithInfo = { ...user, ...additionalInfo };

    console.log("✅ Login successful:", userWithInfo);
    res.json({
      success: true,
      user: userWithInfo,
    });
  } catch (err) {
    console.error("❌ Login failed:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

/* =========================
   GET ALL PRODUCTS
========================= */
app.get("/api/products", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        p.product_id,
        p.seller_id,
        p.product_name,
        p.description,
        p.price_original,
        p.price_discount,
        p.quantity,
        p.expiration_date,
        p.status,
        p.created_at,
        s.shop_name,
        s.shop_address
      FROM product p
      JOIN seller s ON p.seller_id = s.seller_id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Get products failed:", err);
    res.status(500).json({ error: "Get products failed" });
  }
});

/* =========================
   CREATE PRODUCT (SELLER)
========================= */
app.post("/api/products", async (req, res) => {
  try {
    const pool = await poolPromise;
    const {
      sellerId,
      productName,
      description,
      priceOriginal,
      priceDiscount,
      quantity,
      expirationDate,
    } = req.body;

    console.log("📦 Create product attempt:", { sellerId, productName });

    const result = await pool
      .request()
      .input("sellerId", sellerId)
      .input("productName", productName)
      .input("description", description || null)
      .input("priceOriginal", priceOriginal)
      .input("priceDiscount", priceDiscount || null)
      .input("quantity", quantity)
      .input("expirationDate", expirationDate || null).query(`
        INSERT INTO product (
          seller_id, product_name, description, 
          price_original, price_discount, quantity, 
          expiration_date, status
        )
        OUTPUT INSERTED.product_id
        VALUES (
          @sellerId, @productName, @description, 
          @priceOriginal, @priceDiscount, @quantity, 
          @expirationDate, 'active'
        )
      `);

    console.log("✅ Product created:", result.recordset[0].product_id);

    res.json({
      success: true,
      message: "Tạo sản phẩm thành công",
      productId: result.recordset[0].product_id,
    });
  } catch (err) {
    console.error("❌ Create product failed:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      success: false,
      message: "Tạo sản phẩm thất bại",
      details: err.message,
    });
  }
});

/* =========================
   UPDATE PRODUCT (SELLER)
========================= */
app.put("/api/products/:productId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { productId } = req.params;
    const {
      productName,
      description,
      priceOriginal,
      priceDiscount,
      quantity,
      expirationDate,
      status,
    } = req.body;

    await pool
      .request()
      .input("productId", productId)
      .input("productName", productName)
      .input("description", description)
      .input("priceOriginal", priceOriginal)
      .input("priceDiscount", priceDiscount)
      .input("quantity", quantity)
      .input("expirationDate", expirationDate)
      .input("status", status).query(`
        UPDATE product
        SET 
          product_name = @productName,
          description = @description,
          price_original = @priceOriginal,
          price_discount = @priceDiscount,
          quantity = @quantity,
          expiration_date = @expirationDate,
          status = @status,
          updated_at = GETDATE()
        WHERE product_id = @productId
      `);

    res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (err) {
    console.error("❌ Update product failed:", err);
    res.status(500).json({ error: "Update product failed" });
  }
});

/* =========================
   DELETE PRODUCT (SELLER)
========================= */
app.delete("/api/products/:productId", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { productId } = req.params;

    await pool
      .request()
      .input("productId", productId)
      .query(`DELETE FROM product WHERE product_id = @productId`);

    res.json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error("❌ Delete product failed:", err);
    res.status(500).json({ error: "Delete product failed" });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
