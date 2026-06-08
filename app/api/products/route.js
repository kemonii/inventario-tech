import { NextResponse } from "next/server";

import {
  getProducts,
  createProduct,
  updateProduct,
  disableProduct,
} from "@/services/productsService";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al obtener productos",
        detalle: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const {
      codigo_producto,
      nombre_producto,
      descripcion,
      precio,
      stock_actual,
      id_categoria,
      id_marca,
      id_proveedor,
    } = await request.json();

    await createProduct(
      codigo_producto,
      nombre_producto,
      descripcion,
      precio,
      stock_actual,
      id_categoria,
      id_marca,
      id_proveedor
    );

    return NextResponse.json({
      message: "Producto registrado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al registrar producto",
        detalle: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    await updateProduct(
      body.id_producto,
      body.codigo_producto,
      body.nombre_producto,
      body.descripcion,
      body.precio,
      body.stock_actual,
      body.id_categoria,
      body.id_marca,
      body.id_proveedor,
      body.estado
    );

    return NextResponse.json({
      message: "Producto actualizado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al actualizar producto",
        detalle: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_producto } = await request.json();

    await disableProduct(id_producto);

    return NextResponse.json({
      message: "Producto desactivado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al desactivar producto",
        detalle: error.message,
      },
      {
        status: 500,
      }
    );
  }
}