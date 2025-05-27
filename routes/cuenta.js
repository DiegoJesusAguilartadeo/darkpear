const express = require("express");
const authMiddleware = require("./auth");
require("dotenv").config();


const router = express.Router();

router.get("/api/cuenta", authMiddleware, (req, res) => {
  const conexion = req.app.get("conexion");
  const userId = req.user.id;

  const sql = "SELECT username, birthdate, score, created_at, intentos_disponibles FROM usuarios WHERE id = ?";
  conexion.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener la cuenta:", err);
      return res.status(500).json({ message: "Error al obtener la cuenta" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(results[0]);
  });
});

module.exports = router;




  


