

"use client";

import { useState } from "react";

type Proveedor = {
  id_proveedor: number;
  nombre_proveedor: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: "Activo" | "Inactivo";
};

export default function SuppliersPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([
    {
      id_proveedor: 1,
      nombre_proveedor: "Tech Distribuidora CR",
      telefono: "2222-1111",
      correo: "ventas@techcr.com",
      direccion: "San José, Costa Rica",
      estado: "Activo",
    },
    {
      id_proveedor: 2,
      nombre_proveedor: "Importadora Digital",
      telefono: "8888-2222",
      correo: "info@importadoradigital.com",
      direccion: "Heredia, Costa Rica",
      estado: "Activo",
    },
  ]);

  const [nombreProveedor, setNombreProveedor] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [proveedorEditando, setProveedorEditando] =
    useState<Proveedor | null>(null);
  const [mensaje, setMensaje] = useState("");

  const limpiarFormulario = () => {
    setNombreProveedor("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setProveedorEditando(null);
  };

  const guardarProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombreProveedor.trim();
    const telefonoLimpio = telefono.trim();
    const correoLimpio = correo.trim();
    const direccionLimpia = direccion.trim();

    if (
      nombreLimpio === "" ||
      telefonoLimpio === "" ||
      correoLimpio === "" ||
      direccionLimpia === ""
    ) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const existeProveedor = proveedores.some(
      (proveedor) =>
        proveedor.nombre_proveedor.toLowerCase() ===
          nombreLimpio.toLowerCase() &&
        proveedor.id_proveedor !== proveedorEditando?.id_proveedor
    );

    if (existeProveedor) {
      setMensaje("Ya existe un proveedor con ese nombre.");
      return;
    }

    if (!correoLimpio.includes("@")) {
      setMensaje("Debe ingresar un correo válido.");
      return;
    }

    if (proveedorEditando) {
      setProveedores(
        proveedores.map((proveedor) =>
          proveedor.id_proveedor === proveedorEditando.id_proveedor
            ? {
                ...proveedor,
                nombre_proveedor: nombreLimpio,
                telefono: telefonoLimpio,
                correo: correoLimpio,
                direccion: direccionLimpia,
              }
            : proveedor
        )
      );

      limpiarFormulario();
      setMensaje("Proveedor actualizado correctamente.");
      return;
    }

    const nuevoId =
      proveedores.length > 0
        ? Math.max(
            ...proveedores.map((proveedor) => proveedor.id_proveedor)
          ) + 1
        : 1;

    const nuevoProveedor: Proveedor = {
      id_proveedor: nuevoId,
      nombre_proveedor: nombreLimpio,
      telefono: telefonoLimpio,
      correo: correoLimpio,
      direccion: direccionLimpia,
      estado: "Activo",
    };

    setProveedores([...proveedores, nuevoProveedor]);
    limpiarFormulario();
    setMensaje("Proveedor registrado correctamente.");
  };

  const editarProveedor = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setNombreProveedor(proveedor.nombre_proveedor);
    setTelefono(proveedor.telefono);
    setCorreo(proveedor.correo);
    setDireccion(proveedor.direccion);
    setMensaje(`Editando el proveedor: ${proveedor.nombre_proveedor}`);
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setMensaje("Edición cancelada.");
  };

  const desactivarProveedor = (idProveedor: number) => {
    const confirmar = window.confirm(
      "¿Está seguro de desactivar este proveedor?"
    );

    if (!confirmar) return;

    setProveedores(
      proveedores.map((proveedor) =>
        proveedor.id_proveedor === idProveedor
          ? { ...proveedor, estado: "Inactivo" }
          : proveedor
      )
    );

    setMensaje("Proveedor desactivado correctamente.");
  };

  const activarProveedor = (idProveedor: number) => {
    setProveedores(
      proveedores.map((proveedor) =>
        proveedor.id_proveedor === idProveedor
          ? { ...proveedor, estado: "Activo" }
          : proveedor
      )
    );

    setMensaje("Proveedor activado correctamente.");
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>INVENTARIO TECH</p>
          <h1 style={styles.title}>Gestión de Proveedores</h1>
          <p style={styles.subtitle}>
            Administración de proveedores registrados para el inventario.
          </p>
        </div>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            {proveedorEditando ? "Editar proveedor" : "Nuevo proveedor"}
          </h2>

          <form onSubmit={guardarProveedor} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre del proveedor"
              value={nombreProveedor}
              onChange={(e) => setNombreProveedor(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.primaryButton}>
              {proveedorEditando ? "Actualizar" : "Guardar"}
            </button>

            {proveedorEditando && (
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
            <h2 style={styles.cardTitle}>Listado de proveedores</h2>
            <span style={styles.counter}>
              Total: {proveedores.length} registros
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Proveedor</th>
                <th style={styles.th}>Teléfono</th>
                <th style={styles.th}>Correo</th>
                <th style={styles.th}>Dirección</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id_proveedor} style={styles.tr}>
                  <td style={styles.td}>#{proveedor.id_proveedor}</td>
                  <td style={styles.tdStrong}>
                    {proveedor.nombre_proveedor}
                  </td>
                  <td style={styles.td}>{proveedor.telefono}</td>
                  <td style={styles.td}>{proveedor.correo}</td>
                  <td style={styles.td}>{proveedor.direccion}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...(proveedor.estado === "Activo"
                          ? styles.activeStatus
                          : styles.inactiveStatus),
                      }}
                    >
                      {proveedor.estado}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => editarProveedor(proveedor)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>

                    {proveedor.estado === "Activo" ? (
                      <button
                        onClick={() =>
                          desactivarProveedor(proveedor.id_proveedor)
                        }
                        style={styles.deleteButton}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activarProveedor(proveedor.id_proveedor)}
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
    maxWidth: "1200px",
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
    overflowX: "auto" as const,
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
    minWidth: "240px",
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
    whiteSpace: "nowrap" as const,
  },
  tdStrong: {
    padding: "15px",
    color: "#ffffff",
    fontWeight: "bold",
    whiteSpace: "nowrap" as const,
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