// Custom React hook per il polling automatico dei dati azionari ogni 60 secondi.
// Gestisce gli stati interni: { data, isLoading, error }.
// Usa useEffect con setInterval per il polling e cancella il timer al cleanup (unmount del componente).
