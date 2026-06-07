"use client";

import { useState } from "react";

type Marca = {
  id_marca: number;
  nombre_marca: string;
  estado: "Activo" | "Inactivo";
};

export default function BrandsPage() {
  const [marcas, setMarcas] = useState<Marca[]>([
    { id_marca: 1, nombre_marca: "HP", estado: "Activo" },
    { id_marca: 2, nombre_marca: "Samsung", estado: "Activo" },
    { id_marca: 3, nombre_marca: "Apple", estado: "Activo" },
  ]);

  const [nombreMarca, setNombreMarca] = useState("");
  const [marcaEditando, setMarcaEditando] = useState<Marca | null>(null);
  const [mensaje, setMensaje] = useState("");

  const guardarMarca = (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombreMarca.trim();

    if (nombreLimpio === "") {
      setMensaje("Debe ingresar el nombre de la marca.");
      return;
    }

    const existeMarca = marcas.some(
      (marca) =>
        marca.nombre_marca.toLowerCase() === nombreLimpio.toLowerCase() &&
        marca.id_marca !== marcaEditando?.id_marca
    );

    if (existeMarca) {
      setMensaje("Ya existe una marca con ese nombre.");
      return;
    }

    if (marcaEditando) {
      setMarcas(
        marcas.map((marca) =>
          marca.id_marca === marcaEditando.id_marca
            ? { ...marca, nombre_marca: nombreLimpio }
            : marca
        )
      );

      setMarcaEditando(null);
      setNombreMarca("");
      setMensaje("Marca actualizada correctamente.");
      return;
    }

    const nuevoId =
      marcas.length > 0
        ? Math.max(...marcas.map((marca) => marca.id_marca)) + 1
        : 1;

    setMarcas([
      ...marcas,
      {
        id_marca: nuevoId,
        nombre_marca: nombreLimpio,
        estado: "Activo",
      },
    ]);

    setNombreMarca("");
    setMensaje("Marca registrada correctamente.");
  };

  const editarMarca = (marca: Marca) => {
    setMarcaEditando(marca);
    setNombreMarca(marca.nombre_marca);
    setMensaje(`Editando la marca: ${marca.nombre_marca}`);
  };

  const cancelarEdicion = () => {
    setMarcaEditando(null);
    setNombreMarca("");
    setMensaje("Edición cancelada.");
  };

  const desactivarMarca = (idMarca: number) => {
    const confirmar = window.confirm("¿Está seguro de desactivar esta marca?");
    if (!confirmar) return;

    setMarcas(
      marcas.map((marca) =>
        marca.id_marca === idMarca ? { ...marca, estado: "Inactivo" } : marca
      )
    );

    setMensaje("Marca desactivada correctamente.");
  };

  const activarMarca = (idMarca: number) => {
    setMarcas(
      marcas.map((marca) =>
        marca.id_marca === idMarca ? { ...marca, estado: "Activo" } : marca
      )
    );

    setMensaje("Marca activada correctamente.");
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>INVENTARIO TECH</p>
          <h1 style={styles.title}>Gestión de Marcas</h1>
          <p style={styles.subtitle}>
            Administración de marcas asociadas a productos tecnológicos.
          </p>
        </div>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            {marcaEditando ? "Editar marca" : "Nueva marca"}
          </h2>

          <form onSubmit={guardarMarca} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre de la marca"
              value={nombreMarca}
              onChange={(e) => setNombreMarca(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.primaryButton}>
              {marcaEditando ? "Actualizar" : "Guardar"}
            </button>

            {marcaEditando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                style={styles.secondaryButton}
              >
                Cancelar
              </button>
            )}
          </form>

          {mensaje && <p style={styles.message}>{mensaje}</p>}
        </section>

        <section style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Listado de marcas</h2>
            <span style={styles.counter}>Total: {marcas.length} registros</span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nombre Marca</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {marcas.map((marca) => (
                <tr key={marca.id_marca} style={styles.tr}>
                  <td style={styles.td}>#{marca.id_marca}</td>
                  <td style={styles.tdStrong}>{marca.nombre_marca}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...(marca.estado === "Activo"
                          ? styles.activeStatus
                          : styles.inactiveStatus),
                      }}
                    >
                      {marca.estado}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => editarMarca(marca)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>

                    {marca.estado === "Activo" ? (
                      <button
                        onClick={() => desactivarMarca(marca.id_marca)}
                        style={styles.deleteButton}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activarMarca(marca.id_marca)}
                        style={styles.activateButton}
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background:
      "linear-gradient(135deg, #111827 0%, #1f2937 45%, #2f343f 100%)",
    color: "#f9fafb",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "28px",
  },
  label: {
    color: "#d4af37",
    letterSpacing: "3px",
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "42px",
    margin: "0 0 8px 0",
    fontWeight: 700,
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: "16px",
    margin: 0,
  },
  card: {
    background: "rgba(31, 41, 55, 0.92)",
    border: "1px solid rgba(212, 175, 55, 0.25)",
    borderRadius: "20px",
    padding: "26px",
    marginBottom: "26px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginTop: "18px",
  },
  input: {
    flex: 1,
    minWidth: "260px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #4b5563",
    background: "#111827",
    color: "#f9fafb",
    outline: "none",
    fontSize: "15px",
  },
  primaryButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #d4af37, #b8860b)",
    color: "#111827",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "1px solid #6b7280",
    background: "transparent",
    color: "#f9fafb",
    cursor: "pointer",
  },
  message: {
    marginTop: "16px",
    color: "#d4af37",
    fontWeight: "bold",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  counter: {
    color: "#d1d5db",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    textAlign: "left" as const,
    padding: "15px",
    color: "#d4af37",
    borderBottom: "1px solid #4b5563",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid #374151",
  },
  td: {
    padding: "15px",
    color: "#f3f4f6",
  },
  tdStrong: {
    padding: "15px",
    color: "#ffffff",
    fontWeight: "bold",
  },
  status: {
    padding: "7px 13px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  activeStatus: {
    background: "rgba(34, 197, 94, 0.15)",
    color: "#4ade80",
  },
  inactiveStatus: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
  },
  editButton: {
    padding: "9px 14px",
    borderRadius: "10px",
    border: "1px solid #d4af37",
    background: "transparent",
    color: "#d4af37",
    cursor: "pointer",
    marginRight: "8px",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: "9px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#991b1b",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  activateButton: {
    padding: "9px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#166534",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};