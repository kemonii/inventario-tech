import sql from "mssql";
import { getConnection } from "@/lib/db";

export async function getSuppliers() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT id_proveedor, nombre_proveedor, telefono, correo, direccion, estado
    FROM Proveedores
    ORDER BY id_proveedor DESC
  `);

  return result.recordset;
}

export async function createSupplier(
  nombre_proveedor,
  telefono,
  correo,
  direccion
) {
  const pool = await getConnection();

  await pool
    .request()
    .input("nombre_proveedor", sql.VarChar(100), nombre_proveedor)
    .input("telefono", sql.VarChar(20), telefono)
    .input("correo", sql.VarChar(100), correo)
    .input("direccion", sql.VarChar(200), direccion)
    .query(`
      INSERT INTO Proveedores 
      (nombre_proveedor, telefono, correo, direccion, estado)
      VALUES 
      (@nombre_proveedor, @telefono, @correo, @direccion, 'Activo')
    `);
}

export async function updateSupplier(
  id_proveedor,
  nombre_proveedor,
  telefono,
  correo,
  direccion,
  estado
) {
  const pool = await getConnection();

  const request = pool.request().input("id_proveedor", sql.Int, id_proveedor);
  const campos = [];

  if (nombre_proveedor) {
    request.input("nombre_proveedor", sql.VarChar(100), nombre_proveedor);
    campos.push("nombre_proveedor = @nombre_proveedor");
  }

  if (telefono) {
    request.input("telefono", sql.VarChar(20), telefono);
    campos.push("telefono = @telefono");
  }

  if (correo) {
    request.input("correo", sql.VarChar(100), correo);
    campos.push("correo = @correo");
  }

  if (direccion) {
    request.input("direccion", sql.VarChar(200), direccion);
    campos.push("direccion = @direccion");
  }

  if (estado) {
    request.input("estado", sql.VarChar(20), estado);
    campos.push("estado = @estado");
  }

  await request.query(`
    UPDATE Proveedores
    SET ${campos.join(", ")}
    WHERE id_proveedor = @id_proveedor
  `);
}

export async function disableSupplier(id_proveedor) {
  const pool = await getConnection();

  await pool
    .request()
    .input("id_proveedor", sql.Int, id_proveedor)
    .query(`
      UPDATE Proveedores
      SET estado = 'Inactivo'
      WHERE id_proveedor = @id_proveedor
    `);
}