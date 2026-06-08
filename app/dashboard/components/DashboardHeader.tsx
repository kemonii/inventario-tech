"use client";

import styles from "../styles.module.css";
import { useRouter } from "next/navigation";

type DashboardHeaderProps = {
  nombre: string;
  isAdmin: boolean;
};

export default function DashboardHeader({
  nombre,
  isAdmin,
}: DashboardHeaderProps) {

  const router = useRouter();

  function cerrarSesion() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    router.push("/");
  }

  return (
  <div className={styles.header}>
    <div>
      <span className={styles.logo}>
        INVENTARIO TECH
      </span>

      <h1 className={styles.title}>
        Bienvenido, {nombre}
      </h1>

      <p className={styles.role}>
        {isAdmin
          ? "Administrador"
          : "Usuario"}
      </p>
    </div>

    <button
      className={styles.logoutButton}
      onClick={cerrarSesion}
    >
      Cerrar sesión
    </button>
  </div>
);
}