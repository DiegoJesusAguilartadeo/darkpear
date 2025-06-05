const express = require("express");
const router = express.Router();
const authMiddleware = require("./auth");
require("dotenv").config();

document.getElementById("recoverForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const birthdate = document.getElementById("birthdate").value;
  const resultado = document.getElementById("resultado");

  try {
    const res = await fetch("/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, birthdate })
    });

    const data = await res.json();

    if (res.ok) {
      resultado.style.color = "green";
      resultado.textContent = "Tu contraseña es: " + data.password;
    } else {
      resultado.style.color = "red";
      resultado.textContent = data.error || "Error al recuperar la contraseña";
    }
  } catch (err) {
    console.error("Error en fetch:", err);  // Más detalle del error
    resultado.style.color = "red";
    resultado.textContent = "Error de conexión al servidor: " + err.message;
  }
});
module.exports = router;


