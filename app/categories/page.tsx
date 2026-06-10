"use client";

import { useEffect, useState } from "react";

type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
  estado: "Activo" | "Inactivo";
};

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] =
    useState<Categoria | null>(null);
  const [mensaje, setMensaje] = useState("");

  const cargarCategorias = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al cargar categorías.");
        return;
      }

      setCategorias(data);
    } catch {
      setMensaje("No se pudo conectar con la API de categorías.");
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const guardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombreCategoria.trim();

    if (nombreLimpio === "") {
      setMensaje("Debe ingresar el nombre de la categoría.");
      return;
    }

    const existeCategoria = categorias.some(
      (categoria) =>
        categoria.nombre_categoria.toLowerCase() ===
          nombreLimpio.toLowerCase() &&
        categoria.id_categoria !== categoriaEditando?.id_categoria
    );

    if (existeCategoria) {
      setMensaje("Ya existe una categoría con ese nombre.");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: categoriaEditando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          categoriaEditando
            ? {
                id_categoria: categoriaEditando.id_categoria,
                nombre_categoria: nombreLimpio,
              }
            : {
                nombre_categoria: nombreLimpio,
              }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Ocurrió un error al guardar.");
        return;
      }

      setNombreCategoria("");
      setCategoriaEditando(null);
      setMensaje(data.message || "Operación realizada correctamente.");
      cargarCategorias();
    } catch {
      setMensaje("No se pudo conectar con la API de categorías.");
    }
  };

  const editarCategoria = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNombreCategoria(categoria.nombre_categoria);
    setMensaje(`Editando la categoría: ${categoria.nombre_categoria}`);
  };

  const cancelarEdicion = () => {
    setCategoriaEditando(null);
    setNombreCategoria("");
    setMensaje("Edición cancelada.");
  };

  const desactivarCategoria = async (idCategoria: number) => {
    const confirmar = window.confirm(
      "¿Está seguro de desactivar esta categoría?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_categoria: idCategoria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al desactivar categoría.");
        return;
      }

      setMensaje(data.message || "Categoría desactivada correctamente.");
      cargarCategorias();
    } catch {
      setMensaje("No se pudo conectar con la API de categorías.");
    }
  };

  const activarCategoria = async (idCategoria: number) => {
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_categoria: idCategoria,
          estado: "Activo",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al activar categoría.");
        return;
      }

      setMensaje(data.message || "Categoría activada correctamente.");
      cargarCategorias();
    } catch {
      setMensaje("No se pudo conectar con la API de categorías.");
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>INVENTARIO TECH</p>
          <h1 style={styles.title}>Gestión de Categorías</h1>
          <p style={styles.subtitle}>
            Administración de categorías del inventario tecnológico.
          </p>
        </div>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
          </h2>

          <form onSubmit={guardarCategoria} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.primaryButton}>
              {categoriaEditando ? "Actualizar" : "Guardar"}
            </button>

            {categoriaEditando && (
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
            <h2 style={styles.cardTitle}>Listado de categorías</h2>
            <span style={styles.counter}>
              Total: {categorias.length} registros
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nombre Categoría</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id_categoria} style={styles.tr}>
                  <td style={styles.td}>#{categoria.id_categoria}</td>
                  <td style={styles.tdStrong}>{categoria.nombre_categoria}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...(categoria.estado === "Activo"
                          ? styles.activeStatus
                          : styles.inactiveStatus),
                      }}
                    >
                      {categoria.estado}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => editarCategoria(categoria)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>

                    {categoria.estado === "Activo" ? (
                      <button
                        onClick={() =>
                          desactivarCategoria(categoria.id_categoria)
                        }
                        style={styles.deleteButton}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activarCategoria(categoria.id_categoria)}
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