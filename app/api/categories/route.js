import { NextResponse } from "next/server";
import {
  getCategories,
  createCategory,
  updateCategory,
  disableCategory,
} from "@/services/categoriesService";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al obtener categorías",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nombre_categoria } = await request.json();

    if (!nombre_categoria) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    await createCategory(nombre_categoria);

    return NextResponse.json({
      message: "Categoría registrada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al registrar categoría",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id_categoria, nombre_categoria, estado } = await request.json();

    if (!id_categoria) {
      return NextResponse.json(
        { error: "El ID de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    await updateCategory(id_categoria, nombre_categoria, estado);

    return NextResponse.json({
      message: "Categoría actualizada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al actualizar categoría",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_categoria } = await request.json();

    if (!id_categoria) {
      return NextResponse.json(
        { error: "El ID de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    await disableCategory(id_categoria);

    return NextResponse.json({
      message: "Categoría desactivada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al desactivar categoría",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}