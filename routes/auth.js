const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("🛡️ Token recibido:", token);

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      console.log("🚫 Token inválido:", err.message);
      return res.status(401).json({ message: "Token no válido" });
    }

    console.log("✅ Token válido. Usuario:", decoded);
    req.user = decoded;
    next();
  });
}

module.exports = authMiddleware;

