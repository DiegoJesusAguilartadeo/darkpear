const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const bcrypt = require("bcryptjs");

router.post("/api/registro", async (req, res) => {
  const conexion = req.app.get("conexion");
  const { username, password, birthdate } = req.body;

  // Validación básica
  if (!username || !password || !birthdate) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  // Verificar si el usuario ya existe
  const checkUserQuery = "SELECT * FROM usuarios WHERE username = ?";
  conexion.query(checkUserQuery, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });

    if (results.length > 0) {
      return res.status(409).json({ message: "El nombre de usuario ya existe" });
    }

    try {
      // 👉 Aquí estás cifrando la contraseña ANTES de enviarla al procedimiento
      const hashedPassword = await bcrypt.hash(password, 10);

      const callProcedure = "CALL tragaperas_registrar(?, ?, ?)";
      conexion.query(callProcedure, [username, hashedPassword, birthdate], (err) => {
        if (err) {
          console.error("❌ Error en el procedimiento:", err);
          return res.status(500).json({ message: "Error al registrar usuario" });
        }

        res.status(201).json({ message: "Usuario registrado correctamente" });
      });
    } catch (err) {
      console.error("❌ Error al cifrar:", err);
      res.status(500).json({ message: "Error procesando la contraseña" });
    }
  });
});




const bcrypt = require("bcryptjs");

router.post("/api/login", (req, res) => {
  const conexion = req.app.get("conexion");
  const { username, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE username = ?";
  conexion.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }

    const usuario = results[0];
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
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





  
