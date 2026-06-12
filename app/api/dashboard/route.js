// Conexion a la base de datos y consultas para el dashboard
import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function GET() {

  try {

    const pool = await getConnection();

    const productos =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Productos"
        );

    const marcas =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Marcas"
        );

    const categorias =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Categorias"
        );

    const proveedores =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Proveedores"
        );

    const entradas =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Entradas"
        );

    const salidas =
      await pool
        .request()
        .query(
          "SELECT COUNT(*) total FROM Salidas"
        );

    return NextResponse.json({

      productos:
        productos.recordset[0].total,

      marcas:
        marcas.recordset[0].total,

      categorias:
        categorias.recordset[0].total,

      proveedores:
        proveedores.recordset[0].total,

      entradas:
        entradas.recordset[0].total,

      salidas:
        salidas.recordset[0].total

    });

  } catch (error) {

    return NextResponse.json(
      {
        mensaje: error.message
      },
      {
        status: 500
      }
    );

  }

}