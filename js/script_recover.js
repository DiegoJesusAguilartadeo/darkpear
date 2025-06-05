
    document.getElementById("recoverForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const birthdate = document.getElementById("birthdate").value;
      const resultado = document.getElementById("resultado");

      try {
const res = await fetch("/api/recuperar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, birthdate }),
        });

        const data = await res.json();

        if (res.ok) {
          resultado.style.color = "green";
          resultado.textContent = "Tu contraseña es: " + data.password;
        } else {
          resultado.style.color = "red";
          resultado.textContent = data.error || "Error al recuperar la contraseña";
        }
      } catch {
        resultado.style.color = "red";
        resultado.textContent = "Error de conexión al servidor.";
      }
    });
