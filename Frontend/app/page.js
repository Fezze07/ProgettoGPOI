"use client";
import { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [backendMessage, setBackendMessage] = useState(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${backendUrl}/ping`);
        if (!res.ok) {
        const errorText = await res.text();
        console.log("Errore Raw dal server:", errorText);
        setBackendMessage(`Il server ha risposto con errore ${res.status}: ${errorText.substring(0, 100)}...`);
        return;
      }

      const data = await res.json();
        setBackendMessage(`Backend dice: ${JSON.stringify(data)}`);
      } catch (err) {
        setBackendMessage(`Errore nella chiamata al backend: ${err.message}`);
      }
    }
    checkBackend();
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Progetto GPO 🚀</h1>
      <h2>Sito finanziario</h2>
      <p>Frontend online e funzionante.</p>
      {backendMessage && <p>{backendMessage}</p>}
    </main>
  );
}