const token = localStorage.getItem("token");

if (!token) {
  alert("No estás autenticado. Redirigiendo al login...");
  window.location.href = "/html/login.html";
} else {
  fetch("http://localhost:3000/verify", {
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
        window.location.href = "/html/game.html"; // apuntando al archivo correcto
      });

    } else {
      alert("El token no es válido. Redirigiendo al login...");
      localStorage.removeItem("token");
      window.location.href = "/html/login.html";
    }
  })
  .catch(error => {
    console.error(error);
    alert("Error al verificar el token.");
    localStorage.removeItem("token");
    window.location.href = "/html/login.html";
  });
}

// Log Out
document.getElementById("logoutDropdownBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/html/index.html";
});

// Ranking
document.getElementById("rankingbtn").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "/html/ranking.html";
});

// 🌞 Tema claro/oscuro
const themeBtn = document.getElementById("toggleTheme");

function setTheme(isLight) {
  if (isLight) {
    document.documentElement.setAttribute("data-theme", "light");
    themeBtn.textContent = " Modo Oscuro";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeBtn.textContent = " Modo Claro";
  }
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "light");

themeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const isLight = document.documentElement.getAttribute("data-theme") !== "light";
  setTheme(isLight);
});

