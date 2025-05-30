const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();




const partidasRouter = require("./routes/partidas");
const scoreRoutes = require('./routes/score');
const rankingRoutes = require("./routes/top");  // Ajusta ruta si es distinto


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "html")));
// HTML principal

// JS y CSS img
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/img", express.static(path.join(__dirname, "img")));



// Conexión a MySQL
const mysql = require("mysql2");
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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
app.use(require("./routes/score"));
require("./routes/recargar")(app);
app.use(rankingRoutes);







// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});




