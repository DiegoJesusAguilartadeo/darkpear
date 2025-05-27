const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/api/ranking", (req, res) => {
  const conexion = req.app.get("conexion");

  const sql = `
    SELECT username, score, created_at 
    FROM usuarios 
    ORDER BY score DESC 
    LIMIT 10
  `;

  conexion.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ranking:", err);
      return res.status(500).json({ message: "Error al obtener el ranking" });
    }

    res.json(results);
  });
});

// Ruta para servir el archivo HTML del ranking
router.get("/ranking", (req, res) => {
  res.sendFile(path.join(__dirname, "ranking.html"));
});

module.exports = router;

