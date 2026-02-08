require('dotenv').config({ path: __dirname + '.env' });
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotte
const pingRoutes = require("./routes/ping");

app.use("/", pingRoutes);

// Backend/index.js
const PORT = process.env.BACKEND_PORT || 5002;
app.listen(PORT, '0.0.0.0', () => console.log(`AFSF Backend attivo su porta ${PORT}`));
