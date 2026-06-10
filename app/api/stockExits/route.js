/*import { NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET - Obtener todas las salidas de stock
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        s.id_salida,
        s.id_product,
        p.nombre_producto,
        p.codigo_producto,
        s.cantidad,
        s.precio_unitario,
        s.motivo,
        s.fecha_salida,
        s.id_usuario
      FROM Salidas s
      INNER JOIN Productos p ON s.id_product = p.id_product
      ORDER BY s.fecha_salida DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

// POST - Registrar una nueva salida de stock
export async function POST(req) {
  try {
    const { id_product, cantidad, precio_unitario, motivo, id_usuario } =
      await req.json();

    // Validaciones básicas
    if (!id_product || !cantidad || !precio_unitario || !motivo || !id_usuario) {
      return NextResponse.json(
        { mensaje: "Los campos id_product, cantidad, precio_unitario, motivo e id_usuario son obligatorios." },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { mensaje: "La cantidad debe ser mayor a 0." },
        { status: 400 }
      );
    }

    // Verificar que el producto existe, está activo y tiene stock suficiente
    const [producto] = await pool.execute(
      `SELECT id_product, stock_actual FROM Productos WHERE id_product = ? AND estado = 'Activo'`,
      [id_product]
    );

    if (!producto || producto.length === 0) {
      return NextResponse.json(
        { mensaje: "El producto no existe o está inactivo." },
        { status: 404 }
      );
    }

    if (producto[0].stock_actual < cantidad) {
      return NextResponse.json(
        {
          mensaje: `Stock insuficiente. Stock disponible: ${producto[0].stock_actual} unidades.`,
        },
        { status: 400 }
      );
    }

    // Registrar la salida en la tabla Salidas
    const [resultado] = await pool.execute(
      `INSERT INTO Salidas (id_product, cantidad, precio_unitario, motivo, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [id_product, cantidad, precio_unitario, motivo, id_usuario]
    );

    // Actualizar el stock del producto (restar)
    await pool.execute(
      `UPDATE Productos SET stock_actual = stock_actual - ? WHERE id_product = ?`,
      [cantidad, id_product]
    );

    return NextResponse.json(
      {
        mensaje: "Salida de stock registrada correctamente.",
        id_salida: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}
*/
/*version anterior2*/ 
/*
import { NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET - Obtener todas las salidas de stock
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ss.id_salida,
        ss.id_producto,
        p.nombre_producto,
        p.codigo_producto,
        ss.cantidad,
        ss.motivo,
        ss.fecha_salida,
        ss.observaciones
      FROM StockSalidas ss
      INNER JOIN Productos p ON ss.id_producto = p.id_producto
      ORDER BY ss.fecha_salida DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

// POST - Registrar una nueva salida de stock
export async function POST(req) {
  try {
    const { id_producto, cantidad, motivo, observaciones } = await req.json();

    // Validaciones básicas
    if (!id_producto || !cantidad || !motivo) {
      return NextResponse.json(
        { mensaje: "Los campos id_producto, cantidad y motivo son obligatorios." },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { mensaje: "La cantidad debe ser mayor a 0." },
        { status: 400 }
      );
    }

    // Verificar que el producto existe, está activo y tiene stock suficiente
    const [producto] = await pool.execute(
      `SELECT id_producto, stock_actual FROM Productos WHERE id_producto = ? AND estado = 'Activo'`,
      [id_producto]
    );

    if (!producto || producto.length === 0) {
      return NextResponse.json(
        { mensaje: "El producto no existe o está inactivo." },
        { status: 404 }
      );
    }

    if (producto[0].stock_actual < cantidad) {
      return NextResponse.json(
        {
          mensaje: `Stock insuficiente. Stock disponible: ${producto[0].stock_actual} unidades.`,
        },
        { status: 400 }
      );
    }

    // Registrar la salida en la tabla StockSalidas
    const [resultado] = await pool.execute(
      `INSERT INTO StockSalidas (id_producto, cantidad, motivo, observaciones, fecha_salida)
       VALUES (?, ?, ?, ?, NOW())`,
      [id_producto, cantidad, motivo, observaciones || null]
    );

    // Actualizar el stock del producto (restar)
    await pool.execute(
      `UPDATE Productos SET stock_actual = stock_actual - ? WHERE id_producto = ?`,
      [cantidad, id_producto]
    );

    return NextResponse.json(
      {
        mensaje: "Salida de stock registrada correctamente.",
        id_salida: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}
*/
/*version nueva*/ 
import { NextResponse } from "next/server";
import sql from "mssql";
import { getConnection } from "../../../lib/db";

// GET - Obtener todas las salidas de stock
export async function GET() {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        s.id_salida,
        s.id_product,
        p.nombre_producto,
        p.codigo_producto,
        s.cantidad,
        s.precio_unitario,
        s.motivo,
        s.fecha_salida,
        s.id_usuario
      FROM Salidas s
      INNER JOIN Productos p ON s.id_product = p.id_product
      ORDER BY s.fecha_salida DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

// POST - Registrar una nueva salida de stock
export async function POST(req) {
  try {
    const { id_product, cantidad, precio_unitario, motivo, id_usuario } = await req.json();

    if (!id_product || !cantidad || !precio_unitario || !motivo || !id_usuario) {
      return NextResponse.json(
        { mensaje: "Los campos id_product, cantidad, precio_unitario, motivo e id_usuario son obligatorios." },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { mensaje: "La cantidad debe ser mayor a 0." },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Verificar que el producto existe, está activo y tiene stock suficiente
    const productoResult = await pool
      .request()
      .input("id_product", sql.Int, id_product)
      .query(`SELECT id_product, stock_actual FROM Productos WHERE id_product = @id_product AND estado = 'Activo'`);

    if (!productoResult.recordset || productoResult.recordset.length === 0) {
      return NextResponse.json(
        { mensaje: "El producto no existe o está inactivo." },
        { status: 404 }
      );
    }

    const producto = productoResult.recordset[0];

    if (producto.stock_actual < cantidad) {
      return NextResponse.json(
        { mensaje: `Stock insuficiente. Stock disponible: ${producto.stock_actual} unidades.` },
        { status: 400 }
      );
    }

    // Registrar la salida
    await pool
      .request()
      .input("id_product", sql.Int, id_product)
      .input("cantidad", sql.Int, cantidad)
      .input("precio_unitario", sql.Decimal(10, 2), precio_unitario)
      .input("motivo", sql.VarChar(255), motivo)
      .input("id_usuario", sql.Int, id_usuario)
      .query(`
        INSERT INTO Salidas (id_product, cantidad, precio_unitario, motivo, fecha_salida, id_usuario)
        VALUES (@id_product, @cantidad, @precio_unitario, @motivo, GETDATE(), @id_usuario)
      `);

    // Actualizar el stock (restar)
    await pool
      .request()
      .input("cantidad", sql.Int, cantidad)
      .input("id_product", sql.Int, id_product)
      .query(`UPDATE Productos SET stock_actual = stock_actual - @cantidad WHERE id_product = @id_product`);

    return NextResponse.json(
      { mensaje: "Salida de stock registrada correctamente." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}