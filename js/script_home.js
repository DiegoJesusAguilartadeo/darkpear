const token = localStorage.getItem("token");

if (!token) {
  alert("No estás autenticado. Redirigiendo al login...");
  window.location.href = "/html/login.html";
} else {
fetch("/verify", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.valid) {
      document.getElementById("welcome").innerHTML = `
        <a href="#" id="btnIrAlJuego" class="btn-pear">
          Jugar
        </a>
      `;

      document.getElementById("btnIrAlJuego").addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "/game.html"; // apuntando al archivo correcto
      });

    } else {
      alert("El token no es válido. Redirigiendo al login...");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    }
  })
  .catch(error => {
    console.error(error);
    alert("Error al verificar el token.");
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  });
}

// Log Out
document.getElementById("logoutDropdownBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
});

// Ranking
document.getElementById("rankingbtn").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "/ranking.html";
});
// Inicializa el tema desde localStorage o usa "dark" por defecto
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Cambia el texto del botón según el tema actual
  const themeToggle = document.getElementById("toggleTheme");
  if (themeToggle) {
    themeToggle.textContent = savedTheme === "light" ? "Modo Oscuro" : "Modo Claro";
    
    themeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      themeToggle.textContent = nextTheme === "light" ? "Modo Oscuro" : "Modo Claro";
    });
  }


