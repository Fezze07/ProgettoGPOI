// Modulo responsabile della comunicazione HTTP con il backend.
// Espone funzioni async per chiamare /api/stock con i parametri corretti (symbol, interval).
// Gestisce gli errori HTTP e lancia eccezioni strutturate per essere consumate dall'hook useStockData.
