import jwt from "jsonwebtoken";

export function generarToken(usuario) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido. Añade JWT_SECRET a tu .env.local");
  }

  return jwt.sign(
    {
      id: usuario.id_usuario,
      rol: usuario.id_rol,
      nombre: usuario.nombre,
    },
    secret,
    {
      expiresIn: "8h",
    }
  );
}