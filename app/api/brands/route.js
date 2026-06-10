import { NextResponse } from "next/server";
import {
  getBrands,
  createBrand,
  updateBrand,
  disableBrand,
} from "@/services/brandsService";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener marcas", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nombre_marca } = await request.json();

    if (!nombre_marca) {
      return NextResponse.json(
        { error: "El nombre de la marca es obligatorio" },
        { status: 400 }
      );
    }

    await createBrand(nombre_marca);

    return NextResponse.json({
      message: "Marca registrada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar marca", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id_marca, nombre_marca, estado } = await request.json();

    if (!id_marca) {
      return NextResponse.json(
        { error: "El ID de la marca es obligatorio" },
        { status: 400 }
      );
    }

    await updateBrand(id_marca, nombre_marca, estado);

    return NextResponse.json({
      message: "Marca actualizada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar marca", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_marca } = await request.json();

    if (!id_marca) {
      return NextResponse.json(
        { error: "El ID de la marca es obligatorio" },
        { status: 400 }
      );
    }

    await disableBrand(id_marca);

    return NextResponse.json({
      message: "Marca desactivada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al desactivar marca", detalle: error.message },
      { status: 500 }
    );
  }
}