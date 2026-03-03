import pyodbc
def get_connection():
<<<<<<< HEAD
    return pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=KarlK;"
=======
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
>>>>>>> origin/Kiet
        "DATABASE=CDIO;"
        "UID=TranQuangSang;"
        "PWD=123qwe;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
        "Connection Timeout=5;"
    )