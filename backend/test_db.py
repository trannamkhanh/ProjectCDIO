import pyodbc

try:
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=KarlK;"
        "DATABASE=CDIO;"
        "UID=TranQuangSang;"
        "PWD=123qwe;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
    )
    print("✅ CONNECTED")

    cur = conn.cursor()
    cur.execute("SELECT SYSTEM_USER, DB_NAME();")
    print(cur.fetchone())

    conn.close()

except Exception as e:
    print("❌ FAILED")
    print(e)