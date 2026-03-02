from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from db import get_connection
import os

# ✅ Config static folder
app = Flask(__name__, static_folder="static")
CORS(app)

# ✅ Đảm bảo folder upload tồn tại
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# STATIC FILES ROUTE
# =========================
@app.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded images"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404

# =========================
# HOME
# =========================
@app.get("/")
def home():
    return "CDIO Backend Running OK"


# =========================
# AUTH LOGIN
# =========================
@app.post("/api/auth/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                a.account_id,
                a.username,
                a.email,
                a.role,
                a.status,
                b.buyer_id
            FROM account a
            LEFT JOIN buyer b ON a.account_id = b.account_id
            WHERE a.email = ? AND a.password_hash = ?
        """, email, password)

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Sai email hoặc mật khẩu"
            })

        if user.status != "active":
            return jsonify({
                "success": False,
                "message": "Tài khoản chưa active hoặc bị khóa"
            })

        return jsonify({
            "success": True,
            "user": {
                "account_id": user.account_id,
                "username": user.username,
                "buyer_id": user.buyer_id,
                "email": user.email,
                "role": user.role,
                "status": user.status
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# ADMIN: GET ALL BUYERS
# =========================
@app.get("/api/users")
def get_buyers():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
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
        """)

        rows = cursor.fetchall()

        buyers = []
        for r in rows:
            buyers.append({
                "buyer_id": r.buyer_id,
                "full_name": r.full_name,
                "address": r.address,
                "date_of_birth": str(r.date_of_birth),
                "created_at": str(r.created_at),
                "account": {
                    "account_id": r.account_id,
                    "email": r.email,
                    "phone": r.phone,
                    "role": r.role,
                    "status": r.status
                }
            })

        return jsonify(buyers)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# ADMIN: BLOCK USER
# =========================
@app.patch("/api/users/<int:buyerId>/block")
def block_user(buyerId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE account
            SET status = 'locked'
            WHERE account_id = (
                SELECT account_id FROM buyer WHERE buyer_id = ?
            )
        """, buyerId)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# ADMIN: VERIFY USER
# =========================
@app.patch("/api/users/<int:buyerId>/verify")
def verify_user(buyerId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE account
            SET status = 'active'
            WHERE account_id = (
                SELECT account_id FROM buyer WHERE buyer_id = ?
            )
        """, buyerId)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# ADMIN: DELETE BUYER
# =========================
@app.delete("/api/users/<int:buyerId>")
def delete_buyer(buyerId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # lấy account_id
        cursor.execute("SELECT account_id FROM buyer WHERE buyer_id = ?", buyerId)
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Buyer not found"}), 404

        account_id = row.account_id

        # xóa buyer trước
        cursor.execute("DELETE FROM buyer WHERE buyer_id = ?", buyerId)

        # xóa account sau
        cursor.execute("DELETE FROM account WHERE account_id = ?", account_id)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# PRODUCTS: GET ALL
# =========================
@app.get("/api/products")
def get_products():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # ✅ SELECT image_url
        cursor.execute("""
            SELECT product_id, product_name, description,
                   price_original, price_discount,
                   quantity, expiration_date,
                   image_url, status
            FROM product
            WHERE status = 'available'
        """)

        products = []
        for p in cursor.fetchall():
            products.append({
                "product_id": p.product_id,
                "product_name": p.product_name,
                "description": p.description,
                "price_original": float(p.price_original),
                "price_discount": float(p.price_discount) if p.price_discount else None,
                "quantity": p.quantity,
                "expiration_date": str(p.expiration_date),
                "status": p.status,
                "image_url": p.image_url,  # ✅ Trả về image URL
                # ✅ Thêm default values cho frontend
                "category": "Other",
                "store_name": "Store",
                "seller_location": "Location"
            })

        return jsonify(products)

    except Exception as e:
        print(f"ERROR in get_products: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.get("/api/cart/<int:buyerId>")
def get_cart(buyerId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT cart_id FROM cart
            WHERE buyer_id = ? AND status = 'active'
        """, buyerId)

        cart = cursor.fetchone()
        if not cart:
            return jsonify({"items": [], "total": 0})


        cart_id = cart.cart_id

        cursor.execute("""
            SELECT 
                cp.product_id,
                p.product_name,
                p.price_discount,
                p.price_original,
                cp.quantity
            FROM cart_product cp
            JOIN product p ON cp.product_id = p.product_id
            WHERE cp.cart_id = ?
        """, cart_id)

        rows = cursor.fetchall()

        items = []
        total = 0

        for r in rows:
            price = float(r.price_discount or r.price_original)
            subtotal = price * r.quantity

            total += subtotal

            items.append({
                "product_id": r.product_id,
                "product_name": r.product_name,
                "price": price,
                "quantity": r.quantity,
                "subtotal": subtotal
            })

        return jsonify({
            "cart_id": cart_id,
            "items": items,
            "total": total
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# CART: ADD PRODUCT
# =========================
@app.post("/api/cart/add")
def add_to_cart():
    data = request.json
    buyer_id = data.get("buyer_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # tìm cart active
        cursor.execute("""
            SELECT cart_id FROM cart
            WHERE buyer_id = ? AND status = 'active'
        """, buyer_id)

        cart = cursor.fetchone()

        if not cart:
            cursor.execute("""
                INSERT INTO cart (buyer_id, status)
                VALUES (?, 'active')
            """, buyer_id)

            conn.commit()

            cursor.execute("""
                SELECT cart_id FROM cart
                WHERE buyer_id = ? AND status = 'active'
            """, buyer_id)

            cart = cursor.fetchone()

        cart_id = cart.cart_id

        cursor.execute("""
            IF EXISTS (
                SELECT 1 FROM cart_product
                WHERE cart_id = ? AND product_id = ?
            )
            BEGIN
                UPDATE cart_product
                SET quantity = quantity + ?
                WHERE cart_id = ? AND product_id = ?
            END
            ELSE
            BEGIN
                INSERT INTO cart_product(cart_id, product_id, quantity)
                VALUES (?, ?, ?)
            END
        """,
        cart_id, product_id,
        quantity,
        cart_id, product_id,
        cart_id, product_id, quantity)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.patch("/api/cart/update")
def update_cart_quantity():
    data = request.json
    cart_id = data.get("cart_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE cart_product
            SET quantity = ?
            WHERE cart_id = ? AND product_id = ?
        """, quantity, cart_id, product_id)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.delete("/api/cart/remove")
def remove_cart_item():
    data = request.json
    cart_id = data.get("cart_id")
    product_id = data.get("product_id")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM cart_product
            WHERE cart_id = ? AND product_id = ?
        """, cart_id, product_id)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/orders/checkout")
def checkout():
    data = request.json
    buyer_id = data.get("buyer_id")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT cart_id FROM cart
            WHERE buyer_id = ? AND status = 'active'
        """, buyer_id)

        cart = cursor.fetchone()
        if not cart:
            return jsonify({"error": "Cart empty"}), 400

        cart_id = cart.cart_id

        cursor.execute("""
            SELECT cp.product_id, cp.quantity,
                   p.price_discount, p.price_original
            FROM cart_product cp
            JOIN product p ON cp.product_id = p.product_id
            WHERE cp.cart_id = ?
        """, cart_id)

        items = cursor.fetchall()

        if not items:
            return jsonify({"error": "No items in cart"}), 400

        total = 0
        for i in items:
            price = float(i.price_discount or i.price_original)
            total += price * i.quantity

        cursor.execute("""
            INSERT INTO orders (buyer_id, total_amount, order_status)
            VALUES (?, ?, 'pending')
        """, buyer_id, total)

        conn.commit()

        cursor.execute("SELECT TOP 1 order_id FROM orders ORDER BY order_id DESC")
        order_id = cursor.fetchone().order_id

        for i in items:
            price = float(i.price_discount or i.price_original)
            cursor.execute("""
                INSERT INTO order_item(order_id, product_id, price, quantity)
                VALUES (?, ?, ?, ?)
            """, order_id, i.product_id, price, i.quantity)

            cursor.execute("""
                UPDATE product
                SET quantity = quantity - ?
                WHERE product_id = ?
            """, i.quantity, i.product_id)

        cursor.execute("DELETE FROM cart_product WHERE cart_id = ?", cart_id)
        cursor.execute("UPDATE cart SET status='converted' WHERE cart_id = ?", cart_id)

        conn.commit()

        return jsonify({
            "success": True,
            "order_id": order_id,
            "total": total
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/api/orders/<int:buyerId>")
def get_orders(buyerId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT order_id, total_amount, order_status, created_at
            FROM orders
            WHERE buyer_id = ?
            ORDER BY created_at DESC
        """, buyerId)

        rows = cursor.fetchall()

        orders = []
        for o in rows:
            orders.append({
                "order_id": o.order_id,
                "total": float(o.total_amount),
                "status": o.order_status,
                "created_at": str(o.created_at)
            })

        return jsonify(orders)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/products/add")
def add_product():
    data = request.json
    
    try:
        conn = get_connection()
        cursor = conn.cursor()

        account_id = data.get("seller_id")  # Thực ra đang là account_id

        if not account_id:
            return jsonify({"error": "account_id is required"}), 400

        # 🔥 LẤY seller_id TỪ account_id
        cursor.execute(
            "SELECT seller_id FROM seller WHERE account_id = ?",
            (account_id,)
        )

        seller_row = cursor.fetchone()

        if not seller_row:
            return jsonify({"error": "Seller not found"}), 400

        seller_id = seller_row.seller_id

        product_name = data.get("name")
        price_original = data.get("originalPrice")
        price_discount = data.get("rescuePrice")
        quantity = data.get("quantity")
        expiration_date = data.get("expiryDate")
        description = data.get("description", "")
        image_url = data.get("image")  

        if not product_name or price_original is None or quantity is None or not expiration_date:
            return jsonify({"error": "Missing required fields"}), 400

        cursor.execute("""
            INSERT INTO product
            (seller_id, product_name, description, price_original,
             price_discount, quantity, expiration_date, status, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?)
        """,
        seller_id, product_name, description, price_original,
        price_discount, quantity, expiration_date, image_url
        )

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.delete("/api/products/<int:productId>")
def delete_product(productId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE product
            SET status = 'deleted'
            WHERE product_id = ?
        """, productId)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/auth/register")
def register():
    data = request.json

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM account WHERE email = ?", data["email"])
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email đã tồn tại"}), 400

        role = data.get("role", "buyer")
        
        if role not in ["buyer", "seller"]:
            return jsonify({"success": False, "message": "Role không hợp lệ"}), 400

        cursor.execute("""
            INSERT INTO account(username, email, password_hash, phone, role, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        """,
        data["username"],
        data["email"],
        data["password"],
        data["phone"],
        role)

        conn.commit()

        cursor.execute("SELECT TOP 1 account_id FROM account ORDER BY account_id DESC")
        account_id = cursor.fetchone().account_id

        if role == "seller":
            cursor.execute("""
                INSERT INTO seller(account_id, store_name, address, phone)
                VALUES (?, ?, ?, ?)
            """,
            account_id,
            data.get("store_name", ""),
            data.get("address", ""),
            data.get("phone", ""))
            
            conn.commit()
        else:
            cursor.execute("""
                INSERT INTO buyer(account_id, full_name, address, date_of_birth)
                VALUES (?, ?, ?, ?)
            """,
            account_id,
            data.get("full_name", ""),
            data.get("address", ""),
            data.get("date_of_birth", ""))

            conn.commit()

        return jsonify({"success": True, "message": "Đăng ký thành công, chờ admin duyệt"})

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.get("/api/products/<int:productId>")
def product_detail(productId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM product
            WHERE product_id = ? AND status='available'
        """, productId)

        p = cursor.fetchone()
        if not p:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({
            "product_id": p.product_id,
            "product_name": p.product_name,
            "description": p.description,
            "price_original": float(p.price_original),
            "price_discount": float(p.price_discount) if p.price_discount else None,
            "quantity": p.quantity,
            "expiration_date": str(p.expiration_date),
            "image_url": p.image_url  # ✅ Fix: Thêm dấu phẩy
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.put("/api/products/<int:productId>")
def update_product(productId):
    data = request.json

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE product
            SET product_name=?, description=?, price_original=?,
                price_discount=?, quantity=?, expiration_date=?
            WHERE product_id=?
        """,
        data["product_name"],
        data["description"],
        data["price_original"],
        data.get("price_discount"),
        data["quantity"],
        data["expiration_date"],
        productId)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/api/products/search")
def search_products():
    keyword = request.args.get("q", "")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM product
            WHERE status='available'
            AND product_name LIKE ?
        """, f"%{keyword}%")

        rows = cursor.fetchall()

        results = []
        for p in rows:
            results.append({
                "product_id": p.product_id,
                "product_name": p.product_name,
                "price_original": float(p.price_original),
                "price_discount": float(p.price_discount) if p.price_discount else None,
                "quantity": p.quantity
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/api/orders/detail/<int:orderId>")
def order_detail(orderId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT order_id, total_amount, order_status, created_at
            FROM orders WHERE order_id=?
        """, orderId)

        order = cursor.fetchone()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        cursor.execute("""
            SELECT oi.product_id, p.product_name, oi.quantity
            FROM order_item oi
            JOIN product p ON oi.product_id=p.product_id
            WHERE oi.order_id=?
        """, orderId)

        items = cursor.fetchall()

        return jsonify({
            "order_id": order.order_id,
            "total": float(order.total_amount),
            "status": order.order_status,
            "created_at": str(order.created_at),
            "items": [
                {
                    "product_id": i.product_id,
                    "product_name": i.product_name,
                    "quantity": i.quantity
                }
                for i in items
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/api/admin/orders")
def admin_orders():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT order_id, buyer_id, total_amount, order_status, created_at
            FROM orders
            ORDER BY created_at DESC
        """)

        rows = cursor.fetchall()

        return jsonify([
            {
                "order_id": o.order_id,
                "buyer_id": o.buyer_id,
                "total": float(o.total_amount),
                "status": o.order_status,
                "created_at": str(o.created_at)
            }
            for o in rows
        ])

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.patch("/api/admin/orders/<int:orderId>/status")
def update_order_status(orderId):
    data = request.json
    new_status = data.get("status")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE orders
            SET order_status=?
            WHERE order_id=?
        """, new_status, orderId)

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/api/admin/products")
def admin_get_products():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT product_id, product_name, description,
                   price_original, price_discount,
                   quantity, expiration_date,
                   image_url, status
            FROM product
            ORDER BY product_id DESC
        """)

        rows = cursor.fetchall()

        products = []
        for p in rows:
            products.append({
                "product_id": p.product_id,
                "product_name": p.product_name,
                "description": p.description,
                "price_original": float(p.price_original),
                "price_discount": float(p.price_discount) if p.price_discount else None,
                "quantity": p.quantity,
                "expiration_date": str(p.expiration_date),
                "image_url": p.image_url,
                "status": p.status
            })

        return jsonify(products)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# =========================
# SELLER: GET MY PRODUCTS
# =========================
@app.get("/api/seller/<int:accountID>/products")
def get_products_by_seller(accountID):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT p.product_id, p.product_name, p.description,
                   p.price_original, p.price_discount,
                   p.quantity, p.expiration_date,
                   p.image_url, p.status
            FROM product p
            JOIN seller s ON p.seller_id = s.seller_id
            WHERE s.account_id = ?
            ORDER BY p.product_id DESC
        """, (accountID,))

        rows = cursor.fetchall()

        products = []
        for p in rows:
            products.append({
                "product_id": p.product_id,
                "product_name": p.product_name,
                "description": p.description,
                "price_original": float(p.price_original),
                "price_discount": float(p.price_discount) if p.price_discount else None,
                "quantity": p.quantity,
                "expiration_date": str(p.expiration_date),
                "image_url": p.image_url,
                "status": p.status
            })

        return jsonify(products)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.post("/api/upload/image")
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file part"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"success": False, "error": "No selected file"}), 400

        filename = file.filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        return jsonify({
            "success": True,
            "url": f"/static/uploads/{filename}"
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
# =========================
# SELLER: GET ORDERS
# =========================
@app.get("/api/seller/<int:accountId>/orders")
def get_seller_orders(accountId):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT DISTINCT
                o.order_id,
                o.buyer_id,
                o.total_amount,
                o.order_status,
                o.created_at,
                b.full_name as buyer_name,
                a.email as buyer_email,
                a.phone as buyer_phone,
                b.address as buyer_address
            FROM orders o
            JOIN order_item oi ON o.order_id = oi.order_id
            JOIN product p ON oi.product_id = p.product_id
            JOIN seller s ON p.seller_id = s.seller_id
            LEFT JOIN buyer b ON o.buyer_id = b.buyer_id
            LEFT JOIN account a ON b.account_id = a.account_id
            WHERE s.account_id = ?
            ORDER BY o.created_at DESC
        """, (accountId,))   # ✅ ĐÚNG BIẾN

        orders = []
        for row in cursor.fetchall():
            order_id = row.order_id

            cursor.execute("""
                SELECT 
                    p.product_name,
                    oi.quantity,
                    oi.price
                FROM order_item oi
                JOIN product p ON oi.product_id = p.product_id
                JOIN seller s ON p.seller_id = s.seller_id
                WHERE oi.order_id = ? AND s.account_id = ?
            """, (order_id, accountId))  # ✅ ĐÚNG BIẾN

            items = cursor.fetchall()

            orders.append({
                "order_id": order_id,
                "buyer_id": row.buyer_id,
                "total": float(row.total_amount),
                "status": row.order_status,
                "created_at": str(row.created_at),
                "customer": {
                    "name": row.buyer_name,
                    "email": row.buyer_email,
                    "phone": row.buyer_phone,
                    "address": row.buyer_address
                },
                "products": [
                    {
                        "productName": item.product_name,
                        "quantity": item.quantity,
                        "price": float(item.price)
                    }
                    for item in items
                ]
            })

        return jsonify(orders)

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500



# =========================
# START SERVER
# =========================
if __name__ == "__main__":
    print("=" * 50)
    print("🚀 CDIO Backend Starting...")
    print("=" * 50)
    print(f"✅ Server: http://localhost:3000")
    print(f"✅ Upload folder: {UPLOAD_FOLDER}")
    print(f"✅ Static files: http://localhost:3000/static/upload/")
    print("=" * 50)
    app.run(port=3000, debug=True)