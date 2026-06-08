"use client";

import styles from "../styles.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  entradas: number;
  salidas: number;
};

export default function DashboardChart({
  entradas,
  salidas,
}: Props) {

  const data = [
    {
      nombre: "Entradas",
      cantidad: entradas,
    },
    {
      nombre: "Salidas",
      cantidad: salidas,
    },
  ];

  return (
    <div className={styles.chart}>
    
    <br /><br />
      <h2>
        Movimientos de Inventario
      </h2>
      <br />

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.15)" />

          <XAxis dataKey="nombre" />

          <YAxis 
          stroke="#ffffff"
          />

          <Tooltip />

          <Bar
            dataKey="cantidad"
            fill="#d4a62a"
            stroke="#f5d76e"
            strokeWidth={1}
            radius={[8,8,0,0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}