import { NextResponse } from "next/server";
import pool from "../../../lib/db";

// GET - Obtener todas las entradas de stock
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        se.id_entrada,
        se.id_producto,
        p.nombre_producto,
        p.codigo_producto,
        se.cantidad,
        se.precio_unitario,
        se.motivo,
        se.fecha_entrada,
        se.observaciones
      FROM StockEntradas se
      INNER JOIN Productos p ON se.id_producto = p.id_producto
      ORDER BY se.fecha_entrada DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

// POST - Registrar una nueva entrada de stock
export async function POST(req) {
  try {
    const { id_producto, cantidad, precio_unitario, motivo, observaciones } =
      await req.json();

    // Validaciones básicas
    if (!id_producto || !cantidad || !precio_unitario || !motivo) {
      return NextResponse.json(
        { mensaje: "Los campos id_producto, cantidad, precio_unitario y motivo son obligatorios." },
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
      `SELECT id_producto, stock_actual FROM Productos WHERE id_producto = ? AND estado = 'Activo'`,
      [id_producto]
    );

    if (!producto || producto.length === 0) {
      return NextResponse.json(
        { mensaje: "El producto no existe o está inactivo." },
        { status: 404 }
      );
    }

    // Registrar la entrada en la tabla StockEntradas
    const [resultado] = await pool.execute(
      `INSERT INTO StockEntradas (id_producto, cantidad, precio_unitario, motivo, observaciones, fecha_entrada)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [id_producto, cantidad, precio_unitario, motivo, observaciones || null]
    );

    // Actualizar el stock del producto
    await pool.execute(
      `UPDATE Productos SET stock_actual = stock_actual + ? WHERE id_producto = ?`,
      [cantidad, id_producto]
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
