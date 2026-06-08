"use client";

import { useState } from "react";

type Producto = {
  id_producto: number;
  codigo_producto: string;
  nombre_producto: string;
  stock_actual: number;
};

type SalidaStock = {
  id_salida: number;
  id_producto: number;
  nombre_producto: string;
  codigo_producto: string;
  cantidad: number;
  motivo: string;
  observaciones: string;
  fecha_salida: string;
};

const motivosSalida = [
  "Venta",
  "Devolución a proveedor",
  "Producto dañado",
  "Ajuste de inventario",
  "Traslado entre bodegas",
  "Otro",
];

export default function StockExitsPage() {
  const [productos, setProductos] = useState<Producto[]>([
    { id_producto: 1, codigo_producto: "LAP-001", nombre_producto: "Laptop HP Pavilion", stock_actual: 8 },
    { id_producto: 2, codigo_producto: "CEL-001", nombre_producto: "Samsung Galaxy A55", stock_actual: 15 },
  ]);

  const [salidas, setSalidas] = useState<SalidaStock[]>([
    {
      id_salida: 1,
      id_producto: 2,
      nombre_producto: "Samsung Galaxy A55",
      codigo_producto: "CEL-001",
      cantidad: 3,
      motivo: "Venta",
      observaciones: "Venta al cliente #204",
      fecha_salida: "2026-06-02T14:00:00",
    },
  ]);

  const [idProducto, setIdProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  const limpiarFormulario = () => {
    setIdProducto("");
    setCantidad("");
    setMotivo("");
    setObservaciones("");
  };

  const registrarSalida = (e: React.FormEvent) => {
    e.preventDefault();

    const cantidadNum = Number(cantidad);

    if (!idProducto || !cantidad || !motivo) {
      setTipoMensaje("error");
      setMensaje("Todos los campos obligatorios deben completarse.");
      return;
    }

    if (cantidadNum <= 0) {
      setTipoMensaje("error");
      setMensaje("La cantidad debe ser mayor a 0.");
      return;
    }

    const producto = productos.find((p) => p.id_producto === Number(idProducto));
    if (!producto) {
      setTipoMensaje("error");
      setMensaje("Producto no encontrado.");
      return;
    }

    if (producto.stock_actual < cantidadNum) {
      setTipoMensaje("error");
      setMensaje(
        `Stock insuficiente. Stock disponible: ${producto.stock_actual} unidades.`
      );
      return;
    }

    // Registrar salida
    const nuevaSalida: SalidaStock = {
      id_salida: salidas.length > 0 ? Math.max(...salidas.map((s) => s.id_salida)) + 1 : 1,
      id_producto: Number(idProducto),
      nombre_producto: producto.nombre_producto,
      codigo_producto: producto.codigo_producto,
      cantidad: cantidadNum,
      motivo,
      observaciones: observaciones.trim(),
      fecha_salida: new Date().toISOString(),
    };

    setSalidas([nuevaSalida, ...salidas]);

    // Actualizar stock del producto
    setProductos(
      productos.map((p) =>
        p.id_producto === Number(idProducto)
          ? { ...p, stock_actual: p.stock_actual - cantidadNum }
          : p
      )
    );

    limpiarFormulario();
    setTipoMensaje("success");
    setMensaje(
      `Salida registrada: -${cantidadNum} unidades de "${producto.nombre_producto}". Stock actualizado a ${producto.stock_actual - cantidadNum}.`
    );
  };

  const productoSeleccionado = productos.find(
    (p) => p.id_producto === Number(idProducto)
  );

  const stockInsuficiente =
    productoSeleccionado &&
    cantidad &&
    Number(cantidad) > productoSeleccionado.stock_actual;

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>INVENTARIO TECH</p>
          <h1 style={styles.title}>Salidas de Stock</h1>
          <p style={styles.subtitle}>
            Registro de egresos de productos del inventario con actualización automática de stock.
          </p>
        </div>

        {/* Formulario */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Nueva salida de stock</h2>

          <form onSubmit={registrarSalida} style={styles.form}>
            <div style={styles.fieldGroup}>
              <select
                value={idProducto}
                onChange={(e) => setIdProducto(e.target.value)}
                style={styles.input}
              >
                <option value="">Seleccione producto *</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.codigo_producto} — {p.nombre_producto} (Stock: {p.stock_actual})
                  </option>
                ))}
              </select>

              {productoSeleccionado && (
                <div
                  style={{
                    ...styles.stockBadge,
                    ...(stockInsuficiente ? styles.stockBadgeDanger : {}),
                  }}
                >
                  Stock disponible:&nbsp;
                  <strong
                    style={{
                      color: stockInsuficiente ? "#f87171" : "#4ade80",
                    }}
                  >
                    {productoSeleccionado.stock_actual} unidades
                  </strong>
                  {stockInsuficiente && (
                    <span style={{ color: "#f87171", marginLeft: "8px" }}>
                      ⚠ Stock insuficiente
                    </span>
                  )}
                </div>
              )}
            </div>

            <input
              type="number"
              placeholder="Cantidad a retirar *"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              style={{
                ...styles.input,
                borderColor: stockInsuficiente ? "#ef4444" : "#4b5563",
              }}
              min="1"
            />

            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccione motivo *</option>
              {motivosSalida.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Observaciones (opcional)"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              style={styles.input}
            />

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                opacity: stockInsuficiente ? 0.5 : 1,
                cursor: stockInsuficiente ? "not-allowed" : "pointer",
              }}
              disabled={!!stockInsuficiente}
            >
              − Registrar Salida
            </button>
          </form>

          {mensaje && (
            <p
              style={{
                ...styles.message,
                color: tipoMensaje === "success" ? "#4ade80" : "#f87171",
              }}
            >
              {mensaje}
            </p>
          )}
        </section>

        {/* Tabla de salidas */}
        <section style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Historial de salidas</h2>
            <span style={styles.counter}>Total: {salidas.length} registros</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Motivo</th>
                  <th style={styles.th}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {salidas.map((salida) => (
                  <tr key={salida.id_salida} style={styles.tr}>
                    <td style={styles.td}>#{salida.id_salida}</td>
                    <td style={styles.td}>
                      {new Date(salida.fecha_salida).toLocaleDateString("es-CR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td style={styles.td}>{salida.codigo_producto}</td>
                    <td style={styles.tdStrong}>{salida.nombre_producto}</td>
                    <td style={styles.td}>
                      <span style={styles.cantidadBadge}>−{salida.cantidad}</span>
                    </td>
                    <td style={styles.td}>{salida.motivo}</td>
                    <td style={styles.td}>{salida.observaciones || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    background: "linear-gradient(135deg, #111827 0%, #1f2937 45%, #2f343f 100%)",
    color: "#f9fafb",
  },
  container: {
    maxWidth: "1400px",
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
  fieldGroup: {
    flex: 1,
    minWidth: "260px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  input: {
    flex: 1,
    minWidth: "230px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #4b5563",
    background: "#111827",
    color: "#f9fafb",
    outline: "none",
    fontSize: "15px",
  },
  stockBadge: {
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    fontSize: "13px",
    color: "#d1d5db",
  },
  stockBadgeDanger: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  primaryButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "15px",
  },
  message: {
    marginTop: "16px",
    fontWeight: "bold",
    fontSize: "14px",
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
    whiteSpace: "nowrap" as const,
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
  cantidadBadge: {
    padding: "5px 12px",
    borderRadius: "999px",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    fontWeight: "bold",
    fontSize: "13px",
  },
};
