const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth");
require("dotenv").config();

router.post("/obt", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const conexion = req.app.get("conexion");

  const query = "CALL actualizar_score_usuario(?)";

  conexion.query(query, [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al actualizar el score" });
    }

    // Luego de actualizar, obtener el nuevo score para mostrarlo al usuario
    const obtenerScore = "SELECT score FROM usuarios WHERE id = ?";
    conexion.query(obtenerScore, [userId], (err2, results) => {
      if (err2) {
        return res.status(500).json({ error: "Error al obtener el score actualizado" });
      }

      res.json({ mensaje: "Score actualizado correctamente", score: results[0].score });
    });
  });
});

module.exports = router;

