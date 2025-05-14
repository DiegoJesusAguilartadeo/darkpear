const express = require("express");
const cors = require("cors");
const path = require("path");
const partidasRouter = require("./routes/partidas");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexión a MySQL
const mysql = require("mysql2");
const conexion = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin",
  database: "tragaperas"
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// Inyectar conexión en las rutas
app.set("conexion", conexion);

// Importar y usar rutas
app.use(require("./routes/endpoints"));
app.use(require("./routes/cuenta"));
app.use(require("./routes/partidas"));


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});




