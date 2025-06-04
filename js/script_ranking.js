

   document.addEventListener("DOMContentLoaded", () => {
  // Obtener el ranking
  fetch("/api/ranking")
    .then(res => {
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById("tabla-ranking");
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = <tr><td colspan="4">No hay datos de jugadores</td></tr>;
        return;
      }

      // Lanzar confeti después de cargar los datos exitosamente
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#c0c0c0', '#cd7f32'], // Oro, plata, bronce
      });

      data.forEach((jugador, index) => {
        const fila = document.createElement("tr");

        let claseFila = "";
        let trofeo = "";

        if (index === 0) {
          claseFila = "ranking-gold";
          trofeo = "🏆";
        } else if (index === 1) {
          claseFila = "ranking-silver";
          trofeo = "🥈";
        } else if (index === 2) {
          claseFila = "ranking-bronze";
          trofeo = "🥉";
        }

        fila.className = claseFila;
        fila.innerHTML = `
          <td>${index + 1}</td>
          <td>${trofeo ? <span class="trophy-icon">${trofeo}</span> : ""}${jugador.username}</td>
          <td>${jugador.score}</td>
          <td>${new Date(jugador.created_at).toLocaleDateString()}</td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("❌ Error al cargar ranking:", err);
      document.getElementById("tabla-ranking").innerHTML = `
        <tr><td colspan="4">Error al cargar datos.</td></tr>
      `;
    });
});

