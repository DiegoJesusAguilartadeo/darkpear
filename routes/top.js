const express = require("express");
const path = require("path");
const router = express.Router();

// Ruta que llama al procedimiento almacenado "obtener_ranking"
router.get("/api/ranking", (req, res) => {
  const conexion = req.app.get("conexion");

  const sql = "CALL obtener_ranking()"; // ← Llamada al procedimiento

  conexion.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ranking:", err);
      return res.status(500).json({ message: "Error al obtener el ranking" });
    }

    res.json(results[0]); // El resultado está en results[0]
  });
});

// Ruta para servir el archivo HTML del ranking
router.get("/ranking", (req, res) => {
  res.sendFile(path.join(__dirname, "ranking.html"));
});

module.exports = router;


