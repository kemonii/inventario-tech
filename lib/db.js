import sql from "mssql";

const config = {
  user: process.env.DB_USER  || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ControlInventario',
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }

  return pool;
}
