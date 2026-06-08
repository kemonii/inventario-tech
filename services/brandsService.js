import sql from "mssql";
import { getConnection } from "@/lib/db";

export async function getBrands() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT id_marca, nombre_marca, estado
    FROM Marcas
    ORDER BY id_marca DESC
  `);

  return result.recordset;
}

export async function createBrand(nombre_marca) {
  const pool = await getConnection();

  await pool
    .request()
    .input("nombre_marca", sql.VarChar(100), nombre_marca)
    .query(`
      INSERT INTO Marcas (nombre_marca, estado)
      VALUES (@nombre_marca, 'Activo')
    `);
}

export async function updateBrand(id_marca, nombre_marca, estado) {
  const pool = await getConnection();

  const request = pool.request().input("id_marca", sql.Int, id_marca);

  const campos = [];

  if (nombre_marca) {
    request.input("nombre_marca", sql.VarChar(100), nombre_marca);
    campos.push("nombre_marca = @nombre_marca");
  }

  if (estado) {
    request.input("estado", sql.VarChar(20), estado);
    campos.push("estado = @estado");
  }

  await request.query(`
    UPDATE Marcas
    SET ${campos.join(", ")}
    WHERE id_marca = @id_marca
  `);
}

export async function disableBrand(id_marca) {
  const pool = await getConnection();

  await pool
    .request()
    .input("id_marca", sql.Int, id_marca)
    .query(`
      UPDATE Marcas
      SET estado = 'Inactivo'
      WHERE id_marca = @id_marca
    `);
}