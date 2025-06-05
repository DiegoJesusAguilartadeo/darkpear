const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth");
require("dotenv").config();

router.post("/api/recuperar", (req, res) => {
  const { username, birthdate } = req.body;
  const conexion = req.app.get("conexion");

  if (!username || !birthdate) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const query = "SELECT password FROM usuarios WHERE username = ? AND birthdate = ?";
  conexion.query(query, [username, birthdate], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de DB" });
    if (results.length === 0) return res.status(404).json({ error: "No encontrado" });

    res.json({ password: results[0].password });
  });
});

router.get("/recover", (req, res) => {
  res.sendFile(path.join(__dirname, "recover.html"));
});

module.exports = router;


