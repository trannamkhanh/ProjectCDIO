import pyodbc
def get_connection():
    return pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=KarlK;"
        "DATABASE=CDIO;"
        "UID=TranQuangSang;"
        "PWD=123qwe;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
        "Connection Timeout=5;"
    )