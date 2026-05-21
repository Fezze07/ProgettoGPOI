"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import styles from "./Chart.module.css";

export default function StockChart({ data = [], symbol }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nessun dato storico disponibile per {symbol}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{symbol} — Storico Prezzi</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="price_date"
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(v) => new Date(v).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
            domain={["auto", "auto"]}
            width={60}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Chiusura"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString("it-IT")}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#60a5fa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
