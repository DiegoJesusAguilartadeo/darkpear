const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth"); // Asegúrate de que esta ruta sea correcta

router.post("/registrar-partida", authMiddleware, (req, res) => {
  console.log("🔒 Usuario autenticado:", req.user);
  const { puntaje, intentos_usados } = req.body;
  const userId = req.user.id;
  const conexion = req.app.get("conexion");

  // Primero obtenemos los intentos disponibles
  const verificarIntentosQuery = `SELECT intentos_disponibles FROM usuarios WHERE id = ?`;
  conexion.query(verificarIntentosQuery, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al verificar intentos" });
    if (result.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const intentosDisponibles = result[0].intentos_disponibles;

    if (intentosDisponibles <= 0) {
      return res.status(403).json({ message: "No tienes más intentos disponibles" });
    }

    // Registrar la partida
    const insertarPartida = `
      INSERT INTO partidas (usuario_id, puntaje, intentos_usados)
      VALUES (?, ?, ?)
    `;
    conexion.query(insertarPartida, [userId, puntaje, intentos_usados], (err, result) => {
      if (err) return res.status(500).json({ message: "Error al registrar la partida" });

      // Restar 1 intento al usuario
      const actualizarIntentos = `
        UPDATE usuarios SET intentos_disponibles = intentos_disponibles - 1 WHERE id = ?
      `;
      conexion.query(actualizarIntentos, [userId], (err2) => {
        if (err2) return res.status(500).json({ message: "Error al actualizar intentos" });

        res.status(200).json({ message: "Partida registrada", partidaId: result.insertId });
      });
    });
  });
});

module.exports = router;
