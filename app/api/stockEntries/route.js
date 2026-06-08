import { NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET - Obtener todas las entradas de stock
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.id_entrada,
        e.id_product,
        p.nombre_producto,
        p.codigo_producto,
        e.cantidad,
        e.precio_unitario,
        e.fecha_entrada,
        e.id_usuario
      FROM Entradas e
      INNER JOIN Productos p ON e.id_product = p.id_product
      ORDER BY e.fecha_entrada DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

// POST - Registrar una nueva entrada de stock
export async function POST(req) {
  try {
    const { id_product, cantidad, precio_unitario, id_usuario } =
      await req.json();

    // Validaciones básicas
    if (!id_product || !cantidad || !precio_unitario || !id_usuario) {
      return NextResponse.json(
        { mensaje: "Los campos id_product, cantidad, precio_unitario e id_usuario son obligatorios." },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { mensaje: "La cantidad debe ser mayor a 0." },
        { status: 400 }
      );
    }

    if (precio_unitario <= 0) {
      return NextResponse.json(
        { mensaje: "El precio unitario debe ser mayor a 0." },
        { status: 400 }
      );
    }

    // Verificar que el producto existe y está activo
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

    // Registrar la entrada en la tabla Entradas
    const [resultado] = await pool.execute(
      `INSERT INTO Entradas (id_product, cantidad, precio_unitario, id_usuario)
       VALUES (?, ?, ?, ?)`,
      [id_product, cantidad, precio_unitario, id_usuario]
    );

    // Actualizar el stock del producto
    await pool.execute(
      `UPDATE Productos SET stock_actual = stock_actual + ? WHERE id_product = ?`,
      [cantidad, id_product]
    );

    return NextResponse.json(
      {
        mensaje: "Entrada de stock registrada correctamente.",
        id_entrada: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}
