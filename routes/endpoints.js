const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

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
    conexion.query(callProcedure, [username, password, birthdate], (err, results) => {
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

  const sql = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
  conexion.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "tu_clave_secreta",
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

router.get("/verify", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token no válido" });
    }

    res.json({ valid: true, user: decoded });
  });
});

module.exports = router;




  
