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
