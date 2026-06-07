/*
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
*/

//mysql permite importar MySQL
import mysql from "mysql2/promise"; 

const pool = mysql.createPool({ //un pool es un grupo de conexiones reutilizables, reutiliza conexiones
  //Si bien obtiene el host del archivo .env.local el ponemos un or para especificar
  // que debe ser local host, esto no se hace ya que expone datos, pero para entornos controlados nos ayuda a evitar errores
  host: process.env.DB_HOST || "localhost", 

  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "ControlInventario",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; //Permite usar la conexion reutilizable en otros archivos