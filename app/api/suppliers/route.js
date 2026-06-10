import { NextResponse } from "next/server";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  disableSupplier,
} from "@/services/suppliersService";

export async function GET() {
  try {
    const suppliers = await getSuppliers();
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener proveedores", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nombre_proveedor, telefono, correo, direccion } =
      await request.json();

    if (!nombre_proveedor || !telefono || !correo || !direccion) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    await createSupplier(nombre_proveedor, telefono, correo, direccion);

    return NextResponse.json({
      message: "Proveedor registrado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar proveedor", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const {
      id_proveedor,
      nombre_proveedor,
      telefono,
      correo,
      direccion,
      estado,
    } = await request.json();

    if (!id_proveedor) {
      return NextResponse.json(
        { error: "El ID del proveedor es obligatorio" },
        { status: 400 }
      );
    }

    await updateSupplier(
      id_proveedor,
      nombre_proveedor,
      telefono,
      correo,
      direccion,
      estado
    );

    return NextResponse.json({
      message: "Proveedor actualizado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar proveedor", detalle: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_proveedor } = await request.json();

    if (!id_proveedor) {
      return NextResponse.json(
        { error: "El ID del proveedor es obligatorio" },
        { status: 400 }
      );
    }

    await disableSupplier(id_proveedor);

    return NextResponse.json({
      message: "Proveedor desactivado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al desactivar proveedor", detalle: error.message },
      { status: 500 }
    );
  }
}