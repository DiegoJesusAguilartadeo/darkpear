const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth"); // Ajusta la ruta si el middleware está en otra carpeta

router.post("/obt", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const conexion = req.app.get("conexion");

  const obtenerPuntajeTotal = `
    SELECT IFNULL(SUM(puntaje), 0) AS totalPuntos
    FROM partidas
    WHERE usuario_id = ?
  `;

  conexion.query(obtenerPuntajeTotal, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener las puntuaciones" });

    const total = results[0].totalPuntos;

    const actualizarScore = `
      UPDATE usuarios SET score = ? WHERE id = ?
    `;
    conexion.query(actualizarScore, [total, userId], (err2) => {
      if (err2) return res.status(500).json({ error: "Error al actualizar el score" });

      res.json({ mensaje: "Score actualizado correctamente", score: total });
    });
  });
});

module.exports = router;
