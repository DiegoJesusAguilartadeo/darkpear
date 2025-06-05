const express = require("express");
const router = express.Router();

router.get("/api/recuperar", authMiddleware, (req, res) => {
  const { username, birthdate } = req.body;
  const conexion = req.app.get("conexion");

  if (!username || !birthdate) {
    return res.status(400).json({ error: "Faltan datos: username o birthdate" });
  }

  const query = "SELECT password FROM usuarios WHERE username = ? AND birthdate = ?";

  conexion.query(query, [username, birthdate], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario o fecha incorrecta" });
    }

    res.json({ password: results[0].password });
  });
});

module.exports = router;
