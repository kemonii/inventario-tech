import { NextResponse } from "next/server";
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
