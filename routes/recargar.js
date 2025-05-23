// routes/recargar.js
const cron = require("node-cron");

module.exports = function (app) {
  cron.schedule("* * * * *", () => {
    console.log("🕒 Verificando para restablecer intentos...");

    const conexion = app.get("conexion"); // 💥 Este es el que estaba fallando antes

    const query = `
      UPDATE usuarios
      SET intentos_disponibles = LEAST(intentos_disponibles + 1, 5)
      WHERE intentos_disponibles < 5
    `;

    conexion.query(query, (error, results) => {
      if (error) {
        console.error("❌ Error al actualizar los intentos:", error);
      } else {
        console.log(`✅ Intentos actualizados: ${results.affectedRows}`);
      }
    });
  });
};
