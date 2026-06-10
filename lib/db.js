import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
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
