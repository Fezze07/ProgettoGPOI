"use client";
import styles from "./StockCard.module.css";

export default function StockCard({ stock }) {
  // Simulo un prezzo random se non disponibile nel DB per l'estetica
  const price = (Math.random() * 1000).toFixed(2);
  const change = (Math.random() * 10 - 5).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.symbol}>{stock.symbol}</div>
        <div className={styles.exchange}>{stock.exchange}</div>
      </div>
      <div className={styles.name}>{stock.name}</div>
      <div className={styles.priceContainer}>
        <div className={styles.price}>${price}</div>
        <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <div className={styles.footer}>
        <span>{stock.sector}</span>
        <button className={styles.addBtn}>+</button>
      </div>
    </div>
  );
}
