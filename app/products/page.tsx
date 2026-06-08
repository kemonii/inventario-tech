"use client";

import { useEffect, useState } from "react";

type Estado = "Activo" | "Inactivo";

type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
};

type Marca = {
  id_marca: number;
  nombre_marca: string;
};

type Proveedor = {
  id_proveedor: number;
  nombre_proveedor: string;
};

type Producto = {
  id_producto: number;
  codigo_producto: string;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  stock_actual: number;
  id_categoria: number;
  id_marca: number;
  id_proveedor: number;
  estado: Estado;
};

export default function ProductsPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idMarca, setIdMarca] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);
  const [mensaje, setMensaje] = useState("");

  const cargarProductos = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al cargar productos.");
        return;
      }

      setProductos(data);
    } catch {
      setMensaje("Error al cargar productos.");
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (res.ok) {
        setCategorias(data);
      }
    } catch {
      setMensaje("Error al cargar categorías.");
    }
  };

  const cargarMarcas = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();

      if (res.ok) {
        setMarcas(data);
      }
    } catch {
      setMensaje("Error al cargar marcas.");
    }
  };

  const cargarProveedores = async () => {
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();

      if (res.ok) {
        setProveedores(data);
      }
    } catch {
      setMensaje("Error al cargar proveedores.");
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarMarcas();
    cargarProveedores();
  }, []);

  const obtenerNombreCategoria = (id: number) =>
    categorias.find((categoria) => categoria.id_categoria === id)
      ?.nombre_categoria || "Sin categoría";

  const obtenerNombreMarca = (id: number) =>
    marcas.find((marca) => marca.id_marca === id)?.nombre_marca || "Sin marca";

  const obtenerNombreProveedor = (id: number) =>
    proveedores.find((proveedor) => proveedor.id_proveedor === id)
      ?.nombre_proveedor || "Sin proveedor";

  const limpiarFormulario = () => {
    setCodigoProducto("");
    setNombreProducto("");
    setDescripcion("");
    setPrecio("");
    setStockActual("");
    setIdCategoria("");
    setIdMarca("");
    setIdProveedor("");
    setProductoEditando(null);
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    const codigoLimpio = codigoProducto.trim();
    const nombreLimpio = nombreProducto.trim();
    const descripcionLimpia = descripcion.trim();
    const precioNumero = Number(precio);
    const stockNumero = Number(stockActual);

    if (
      codigoLimpio === "" ||
      nombreLimpio === "" ||
      descripcionLimpia === "" ||
      precio === "" ||
      stockActual === "" ||
      idCategoria === "" ||
      idMarca === "" ||
      idProveedor === ""
    ) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (precioNumero <= 0) {
      setMensaje("El precio debe ser mayor a 0.");
      return;
    }

    if (stockNumero < 0) {
      setMensaje("El stock no puede ser negativo.");
      return;
    }

    const existeCodigo = productos.some(
      (producto) =>
        producto.codigo_producto.toLowerCase() === codigoLimpio.toLowerCase() &&
        producto.id_producto !== productoEditando?.id_producto
    );

    if (existeCodigo) {
      setMensaje("Ya existe un producto con ese código.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: productoEditando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: productoEditando?.id_producto,
          codigo_producto: codigoLimpio,
          nombre_producto: nombreLimpio,
          descripcion: descripcionLimpia,
          precio: precioNumero,
          stock_actual: stockNumero,
          id_categoria: Number(idCategoria),
          id_marca: Number(idMarca),
          id_proveedor: Number(idProveedor),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Ocurrió un error al guardar el producto.");
        return;
      }

      limpiarFormulario();
      cargarProductos();

      setMensaje(
        data.message ||
          (productoEditando
            ? "Producto actualizado correctamente."
            : "Producto registrado correctamente.")
      );
    } catch {
      setMensaje("No se pudo conectar con la API de productos.");
    }
  };

  const editarProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setCodigoProducto(producto.codigo_producto);
    setNombreProducto(producto.nombre_producto);
    setDescripcion(producto.descripcion);
    setPrecio(String(producto.precio));
    setStockActual(String(producto.stock_actual));
    setIdCategoria(String(producto.id_categoria));
    setIdMarca(String(producto.id_marca));
    setIdProveedor(String(producto.id_proveedor));
    setMensaje(`Editando el producto: ${producto.nombre_producto}`);
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setMensaje("Edición cancelada.");
  };

  const desactivarProducto = async (idProducto: number) => {
    const confirmar = window.confirm(
      "¿Está seguro de desactivar este producto?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: idProducto,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al desactivar producto.");
        return;
      }

      cargarProductos();
      setMensaje(data.message || "Producto desactivado correctamente.");
    } catch {
      setMensaje("No se pudo conectar con la API de productos.");
    }
  };

  const activarProducto = async (idProducto: number) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: idProducto,
          estado: "Activo",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al activar producto.");
        return;
      }

      cargarProductos();
      setMensaje(data.message || "Producto activado correctamente.");
    } catch {
      setMensaje("No se pudo conectar con la API de productos.");
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>INVENTARIO TECH</p>
          <h1 style={styles.title}>Gestión de Productos</h1>
          <p style={styles.subtitle}>
            Administración de productos relacionados con categorías, marcas y
            proveedores.
          </p>
        </div>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            {productoEditando ? "Editar producto" : "Nuevo producto"}
          </h2>

          <form onSubmit={guardarProducto} style={styles.form}>
            <input
              type="text"
              placeholder="Código del producto"
              value={codigoProducto}
              onChange={(e) => setCodigoProducto(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Nombre del producto"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Stock actual"
              value={stockActual}
              onChange={(e) => setStockActual(e.target.value)}
              style={styles.input}
            />

            <select
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccione categoría</option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nombre_categoria}
                </option>
              ))}
            </select>

            <select
              value={idMarca}
              onChange={(e) => setIdMarca(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccione marca</option>
              {marcas.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.nombre_marca}
                </option>
              ))}
            </select>

            <select
              value={idProveedor}
              onChange={(e) => setIdProveedor(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccione proveedor</option>
              {proveedores.map((proveedor) => (
                <option
                  key={proveedor.id_proveedor}
                  value={proveedor.id_proveedor}
                >
                  {proveedor.nombre_proveedor}
                </option>
              ))}
            </select>

            <button type="submit" style={styles.primaryButton}>
              {productoEditando ? "Actualizar" : "Guardar"}
            </button>

            {productoEditando && (
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
            <h2 style={styles.cardTitle}>Listado de productos</h2>
            <span style={styles.counter}>
              Total: {productos.length} registros
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Marca</th>
                <th style={styles.th}>Proveedor</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto} style={styles.tr}>
                  <td style={styles.td}>#{producto.id_producto}</td>
                  <td style={styles.td}>{producto.codigo_producto}</td>
                  <td style={styles.tdStrong}>{producto.nombre_producto}</td>
                  <td style={styles.td}>
                    {obtenerNombreCategoria(producto.id_categoria)}
                  </td>
                  <td style={styles.td}>
                    {obtenerNombreMarca(producto.id_marca)}
                  </td>
                  <td style={styles.td}>
                    {obtenerNombreProveedor(producto.id_proveedor)}
                  </td>
                  <td style={styles.td}>₡{producto.precio.toLocaleString()}</td>
                  <td style={styles.td}>{producto.stock_actual}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...(producto.estado === "Activo"
                          ? styles.activeStatus
                          : styles.inactiveStatus),
                      }}
                    >
                      {producto.estado}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => editarProducto(producto)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>

                    {producto.estado === "Activo" ? (
                      <button
                        onClick={() =>
                          desactivarProducto(producto.id_producto)
                        }
                        style={styles.deleteButton}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activarProducto(producto.id_producto)}
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
    minWidth: "230px",
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