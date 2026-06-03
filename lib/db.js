// Importamos la librería mssql para conectarnos a la base de datos SQL Server
import sql from 'mssql'

const config = {
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
  server: process.env.DB_SERVER, // Servidor de la base de datos
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  },
  port: 1433 // Puerto por defecto para SQL Server
}

// Variable para almacenar la conexión a la base de datos
// Evitar abrir una nueva conexión cada vez que se necesite acceder a la base de datos
let pool

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}
