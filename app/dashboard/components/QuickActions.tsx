"use client";

import styles from "../styles.module.css";
import Link from "next/link";

type Props = {
  isAdmin: boolean;
};

export default function QuickActions({
  isAdmin,
}: Props) {

  return (
    <div className={styles.quickActions}>
      <h2>
        Accesos rápidos
      </h2>
      <br />

        <div className={styles.links}>
        <Link href="/products">
          Productos
        </Link>

        <Link href="/stockEntries">
          Entradas
        </Link>

        <Link href="/stockExits">
          Salidas
        </Link>

        {isAdmin && (
          <>
            <Link href="/brands">
              Marcas
            </Link>

            <Link href="/categories">
              Categorías
            </Link>

            <Link href="/suppliers">
              Proveedores
            </Link>
          </>
        )}
      </div>
    </div>
  );
}