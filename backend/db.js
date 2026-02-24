import sql from "mssql";

const config = {
  user: "cdio_user",
  password: "123456",
  server: "localhost\\SQLEXPRESS",
  database: "CDIO",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err);
  });
