const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth"); // Asegúrate de que esta ruta sea correcta
require("dotenv").config();


router.post("/registrar-partida", authMiddleware, (req, res) => {
  const { puntaje, intentos_usados } = req.body;
  const userId = req.user.id;
  const conexion = req.app.get("conexion");

  const sql = "CALL registrar_partida(?, ?, ?)";
  conexion.query(sql, [userId, puntaje, intentos_usados], (err, results) => {
    if (err) {
      console.error("❌ Error al registrar partida:", err.sqlMessage || err.message);
      
      if (err.sqlState === "45000") {
        return res.status(403).json({ message: err.sqlMessage });
      }

      return res.status(500).json({ message: "Error al registrar la partida" });
    }

    const partidaId = results[0][0].partida_id;
    res.status(200).json({ message: "Partida registrada", partidaId });
  });
});






module.exports = router;
