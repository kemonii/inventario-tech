import sql from "mssql";
import { getConnection } from "@/lib/db";

export async function getCategories() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT id_categoria, nombre_categoria, estado
    FROM Categorias
    ORDER BY id_categoria DESC
  `);

  return result.recordset;
}

export async function createCategory(nombre_categoria) {
  const pool = await getConnection();

  await pool
    .request()
    .input("nombre_categoria", sql.VarChar(100), nombre_categoria)
    .query(`
      INSERT INTO Categorias (nombre_categoria, estado)
      VALUES (@nombre_categoria, 'Activo')
    `);
}

export async function updateCategory(id_categoria, nombre_categoria, estado) {
  const pool = await getConnection();

  const request = pool.request().input("id_categoria", sql.Int, id_categoria);

  if (nombre_categoria) {
    request.input("nombre_categoria", sql.VarChar(100), nombre_categoria);
  }

  if (estado) {
    request.input("estado", sql.VarChar(20), estado);
  }

  let campos = [];

  if (nombre_categoria) {
    campos.push("nombre_categoria = @nombre_categoria");
  }

  if (estado) {
    campos.push("estado = @estado");
  }

  await request.query(`
    UPDATE Categorias
    SET ${campos.join(", ")}
    WHERE id_categoria = @id_categoria
  `);
}

export async function disableCategory(id_categoria) {
  const pool = await getConnection();

  await pool
    .request()
    .input("id_categoria", sql.Int, id_categoria)
    .query(`
      UPDATE Categorias
      SET estado = 'Inactivo'
      WHERE id_categoria = @id_categoria
    `);
}