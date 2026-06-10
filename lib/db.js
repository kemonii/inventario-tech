import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

let pool;

export async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log("✅ Conexión a SQL Server establecida correctamente.");
    } catch (error) {
      console.error("❌ Error al conectar con SQL Server:", error.message);
      throw new Error(`No se pudo conectar a la base de datos: ${error.message}`);
    }
  }
  return pool;
}

export default { getConnection };