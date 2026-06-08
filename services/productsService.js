import sql from "mssql";
import { getConnection } from "@/lib/db";

export async function getProducts() {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT
      id_product AS id_producto,
      codigo_producto,
      nombre_producto,
      descripcion,
      precio,
      stock_actual,
      id_categoria,
      id_marca,
      id_proveedor,
      estado
    FROM Productos
    ORDER BY id_product DESC
  `);

  return result.recordset;
}

export async function createProduct(
  codigo_producto,
  nombre_producto,
  descripcion,
  precio,
  stock_actual,
  id_categoria,
  id_marca,
  id_proveedor
) {
  const pool = await getConnection();

  await pool
    .request()
    .input("codigo_producto", sql.VarChar(50), codigo_producto)
    .input("nombre_producto", sql.VarChar(150), nombre_producto)
    .input("descripcion", sql.VarChar(200), descripcion)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("stock_actual", sql.Int, stock_actual)
    .input("id_categoria", sql.Int, id_categoria)
    .input("id_marca", sql.Int, id_marca)
    .input("id_proveedor", sql.Int, id_proveedor)
    .query(`
      INSERT INTO Productos (
        codigo_producto,
        nombre_producto,
        descripcion,
        precio,
        stock_actual,
        id_categoria,
        id_marca,
        id_proveedor,
        estado
      )
      VALUES (
        @codigo_producto,
        @nombre_producto,
        @descripcion,
        @precio,
        @stock_actual,
        @id_categoria,
        @id_marca,
        @id_proveedor,
        'Activo'
      )
    `);
}

export async function updateProduct(
  id_producto,
  codigo_producto,
  nombre_producto,
  descripcion,
  precio,
  stock_actual,
  id_categoria,
  id_marca,
  id_proveedor,
  estado
) {
  const pool = await getConnection();

  const request = pool
    .request()
    .input("id_producto", sql.Int, id_producto);

  const campos = [];

  if (codigo_producto !== undefined) {
    request.input("codigo_producto", sql.VarChar(50), codigo_producto);
    campos.push("codigo_producto = @codigo_producto");
  }

  if (nombre_producto !== undefined) {
    request.input("nombre_producto", sql.VarChar(150), nombre_producto);
    campos.push("nombre_producto = @nombre_producto");
  }

  if (descripcion !== undefined) {
    request.input("descripcion", sql.VarChar(200), descripcion);
    campos.push("descripcion = @descripcion");
  }

  if (precio !== undefined) {
    request.input("precio", sql.Decimal(10, 2), precio);
    campos.push("precio = @precio");
  }

  if (stock_actual !== undefined) {
    request.input("stock_actual", sql.Int, stock_actual);
    campos.push("stock_actual = @stock_actual");
  }

  if (id_categoria !== undefined) {
    request.input("id_categoria", sql.Int, id_categoria);
    campos.push("id_categoria = @id_categoria");
  }

  if (id_marca !== undefined) {
    request.input("id_marca", sql.Int, id_marca);
    campos.push("id_marca = @id_marca");
  }

  if (id_proveedor !== undefined) {
    request.input("id_proveedor", sql.Int, id_proveedor);
    campos.push("id_proveedor = @id_proveedor");
  }

  if (estado !== undefined) {
    request.input("estado", sql.VarChar(20), estado);
    campos.push("estado = @estado");
  }

  if (campos.length === 0) {
    return;
  }

  await request.query(`
    UPDATE Productos
    SET ${campos.join(", ")}
    WHERE id_product = @id_producto
  `);
}

export async function disableProduct(id_producto) {
  const pool = await getConnection();

  await pool
    .request()
    .input("id_producto", sql.Int, id_producto)
    .query(`
      UPDATE Productos
      SET estado = 'Inactivo'
      WHERE id_product = @id_producto
    `);
}