// Bootstrap del server backend Node.js/Express.
// Carica la configurazione da env.js, registra le route da routes/stockRoutes.js e avvia il server in ascolto sulla porta configurata.
// Punto di ingresso principale del processo backend.

require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotte
const pingRoutes = require("./routes/ping");

app.use("/", pingRoutes);

// Backend/index.js
const PORT = process.env.BACKEND_PORT;
app.listen(PORT, '0.0.0.0', () => console.log(`AFSF Backend attivo su porta ${PORT}`));
