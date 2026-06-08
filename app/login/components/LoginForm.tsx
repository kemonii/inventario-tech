"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles.module.css";
// NUEVO: Importamos useRouter para redireccionar después del login
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioLogeado, setUsuarioLogeado] = useState<null | { nombre: string; isAdmin: boolean; rol?: number }>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        const u = JSON.parse(raw);
        setUsuarioLogeado({ nombre: u.nombre, isAdmin: !!u.isAdmin, rol: u.rol });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  async function iniciarSesion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();
      setLoading(false);

      // Nuevo: Si el login es exitoso, guardamos el token y redireccionamos al dashboard
      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "usuario",
          JSON.stringify(data.usuario)
        );
        router.push("/dashboard");
      }

      /*if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setUsuarioLogeado({ nombre: data.usuario.nombre, isAdmin: !!data.usuario.isAdmin, rol: data.usuario.rol });
        setCorreo("");
        setPassword("");
      } else {
        setError(data.mensaje || "Error en el login");
      }*/
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Error de red");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <form onSubmit={iniciarSesion} className={styles.card}>
          <h1 className={styles.title}>Iniciar Sesión</h1>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Correo</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={styles.input}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {usuarioLogeado && (
            <div className={styles.userInfo}>
              <div>
                <div className={styles.welcome}>Bienvenido, {usuarioLogeado.nombre}</div>
                <div className={styles.role}>Rol: {usuarioLogeado.rol ?? "-"}</div>
              </div>
              <div>
                {usuarioLogeado.isAdmin ? (
                  <span className={`${styles.badge} ${styles.badgeAdmin}`}>Administrador</span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeUser}`}>Usuario</span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
