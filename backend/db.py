import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=CDIO;"
        "UID=cdio_user;"
        "PWD=123456;"
        "TrustServerCertificate=yes;"
    )
    return conn
