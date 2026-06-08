"use client";

import QuickActions from "./components/QuickActions";
import styles from "./styles.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "./components/DashboardHeader";
import DashboardCard from "./components/DashboardCard";
import DashboardChart from "./components/DashboardChart";

import {
  obtenerDashboard,
} from "../../services/dashboardService";

export default function DashboardPage() {

  const router = useRouter();

  const [usuario, setUsuario] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const usuarioGuardado =
      localStorage.getItem("usuario");

    if (
      !token ||
      !usuarioGuardado
    ) {
      router.push("/");
      return;
    }

    setUsuario(
      JSON.parse(usuarioGuardado)
    );

    cargarDatos();

  }, []);

  async function cargarDatos() {

    try {

      const data =
        await obtenerDashboard();

      setStats(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  if (!usuario) {
    return null;
  }

  return (
  <div className={styles.container}>

    <DashboardHeader
      nombre={usuario.nombre}
      isAdmin={usuario.isAdmin}
    />

    <QuickActions
      isAdmin={usuario.isAdmin}
    />

    <div className={styles.cardsGrid}>

      <DashboardCard
        titulo="Productos"
        valor={stats.productos}
        ruta="/products"
      />

      {usuario.isAdmin && (
        <>
          <DashboardCard
            titulo="Marcas"
            valor={stats.marcas}
            ruta="/brands"
          />

          <DashboardCard
            titulo="Categorías"
            valor={stats.categorias}
            ruta="/categories"
          />

          <DashboardCard
            titulo="Proveedores"
            valor={stats.proveedores}
            ruta="/suppliers"
          />
        </>
      )}

      <DashboardCard
        titulo="Entradas"
        valor={stats.entradas}
        ruta="/stockEntries"
      />

      <DashboardCard
        titulo="Salidas"
        valor={stats.salidas}
        ruta="/stockExits"
      />

    </div>

    <DashboardChart
      entradas={stats.entradas}
      salidas={stats.salidas}
    />

  </div>
);
}