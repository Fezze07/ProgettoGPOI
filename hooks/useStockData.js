import { useState, useEffect } from 'react';
import { getInstruments } from '../services/stockService';

/**
 * Hook per caricare l'elenco dei titoli disponibili e gestire gli stati di caricamento.
 */
export function useStockData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      const instruments = await getInstruments();
      setData(instruments);
      setError(null);
    } catch (err) {
      console.error('Error fetching instruments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    
    // Polling ogni 2 minuti per aggiornamenti (simulato)
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refresh: fetchData };
}
