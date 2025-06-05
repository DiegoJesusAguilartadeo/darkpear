const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

router.post("/api/registro", (req, res) => {
  const conexion = req.app.get("conexion");
  const { username, password, birthdate } = req.body;

  if (!username || !password || !birthdate) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const checkUserQuery = "SELECT * FROM usuarios WHERE username = ?";
  conexion.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("❌ Error al verificar usuario:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "El nombre de usuario ya está registrado" });
    }

    const callProcedure = "CALL tragaperas_registrar(?, ?, ?)";
    conexion.query(callProcedure, [username, password, birtmyhdate], (err, results) => {
      if (err) {
        console.error("❌ Error al ejecutar el procedimiento:", err);
        return res.status(500).json({ message: "Error al guardar el usuario" });
      }

      return res.status(200).json({ message: "Usuario registrado correctamente" });
    });
  });
});



router.post("/api/login", (req, res) => {
  const conexion = req.app.get("conexion");
  const { username, password } = req.body;

  const sql = "CALL iniciar_sesion(?, ?)";
  conexion.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }

    const usuario = results[0][0]; // Primer usuario del primer conjunto de resultados

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

module.exports = router;


router.get("/verify", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // ✅ Usa la clave del .env
    if (err) {
      return res.status(401).json({ message: "Token no válido" });
    }

    res.json({ valid: true, user: decoded });
  });
});

module.exports = router;





  
