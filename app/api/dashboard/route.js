import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {

  try {

    const [productos] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Productos"
      );

    const [marcas] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Marcas"
      );

    const [categorias] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Categorias"
      );

    const [proveedores] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Proveedores"
      );

    const [entradas] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Entradas"
      );

    const [salidas] =
      await pool.execute(
        "SELECT COUNT(*) total FROM Salidas"
      );

    return NextResponse.json({

      productos:
        productos[0].total,

      marcas:
        marcas[0].total,

      categorias:
        categorias[0].total,

      proveedores:
        proveedores[0].total,

      entradas:
        entradas[0].total,

      salidas:
        salidas[0].total

    });

  } catch (error) {

    return NextResponse.json(
      {
        mensaje:
          error.message
      },
      {
        status: 500
      }
    );

  }
}

/*
SQL SERVER

import { getConnection }
from "../../../lib/db";

const pool =
 await getConnection();

const productos =
 await pool
  .request()
  .query(
   "SELECT COUNT(*) total FROM Productos"
  );

const total =
 productos.recordset[0].total;
*/