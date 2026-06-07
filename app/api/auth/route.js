import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import { generarToken } from "../../../lib/auth";

export async function POST(req) {
  try {
    const { correo, password } = await req.json();

    const [rows] = await pool.execute(
      `SELECT * FROM Usuarios WHERE correo = ? AND estado = 'Activo'`,
      [correo]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { mensaje: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const usuario = rows[0];

      // Support different DB column names and buffer types for the stored password
      let storedPassword = usuario.password ?? usuario.contrasena ?? usuario.clave ?? usuario.pass;
      if (storedPassword == null) {
        return NextResponse.json(
          { mensaje: "Usuario no tiene contraseña almacenada en la base de datos" },
          { status: 500 }
        );
      }

      if (Buffer.isBuffer(storedPassword)) {
        storedPassword = storedPassword.toString("utf8");
      } else if (typeof storedPassword !== "string") {
        storedPassword = String(storedPassword);
      }

      const passwordCorrecta = await bcrypt.compare(password, storedPassword);

    if (!passwordCorrecta) {
      return NextResponse.json(
        { mensaje: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const token = generarToken(usuario);

    const isAdmin = Number(usuario.id_rol) === 1;

    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.id_rol,
        isAdmin,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { mensaje: error.message },
      { status: 500 }
    );
  }
}