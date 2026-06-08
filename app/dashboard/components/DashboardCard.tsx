"use client";

import styles from "../styles.module.css";
import { useRouter } from "next/navigation";

type Props = {
  titulo: string;
  valor: number;
  ruta: string;
};

export default function DashboardCard({
  titulo,
  valor,
  ruta,
}: Props) {

  const router = useRouter();

  return (
    <div
    className={styles.card}
      onClick={() => router.push(ruta)}
    >
      <h3>{titulo}</h3>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {valor}
      </p>
    </div>
  );
}