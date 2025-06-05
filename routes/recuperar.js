const express = require("express");
const router = express.Router();

router.post("/api/recuperar", (req, res) => {
  const { username, birthdate } = req.body;

  if (!username || !birthdate) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const conexion = req.app.get("conexion");

  const sql = "SELECT password FROM usuarios WHERE username = ? AND birthdate = ?";
  conexion.query(sql, [username, birthdate], (err, results) => {
    if (err) {
      console.error("❌ Error al consultar la base de datos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado o datos incorrectos" });
    }

    res.json({ password: results[0].password });
  });
});

module.exports = router;

