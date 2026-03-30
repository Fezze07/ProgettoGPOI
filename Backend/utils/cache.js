// Implementa una cache in-memory con TTL configurabile (60–120 secondi).
// Espone funzioni per: leggere un valore cached (get), scrivere un nuovo valore (set), verificare la scadenza (isExpired).
// Evita chiamate ridondanti ad Alpha Vantage durante il periodo di validità del TTL.
