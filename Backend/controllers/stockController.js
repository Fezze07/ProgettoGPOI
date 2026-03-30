// Orchestratore della logica di business per le richieste sui titoli azionari.
// Coordina il flusso: verifica cache → chiama alphaVantageService se cache mancante → formatta la risposta → risponde al client.
// Non contiene accesso diretto a dati o chiamate HTTP esterne.
