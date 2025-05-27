const cron = require("node-cron");
require("dotenv").config();

module.exports = function (app) {
  cron.schedule("* * * * *", () => {
    console.log("🕒 Verificando para restablecer intentos...");

    const conexion = app.get("conexion");

    const query = "CALL actualizar_intentos()";

    conexion.query(query, (error, results) => {
      if (error) {
        console.error("❌ Error al ejecutar el procedimiento:", error);
      } else {
        console.log("✅ Procedimiento ejecutado correctamente.");
      }
    });
  });
};

