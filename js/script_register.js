const $submit = document.getElementById("submit"), 
      $password = document.getElementById("password"),
      $username = document.getElementById("username"),
      $dob = document.getElementById("dob"),
      $visible = document.getElementById("visible");

document.addEventListener("change", (e) => {
    if (e.target === $visible) {
        $password.type = $visible.checked ? "text" : "password";
    }
});

function mostrar_mensaje(html) {
  const mensaje = document.getElementById("mensaje");
  const velo = document.getElementById("velo");

  mensaje.innerHTML = html;
  velo.style.display = "flex";

  // Resetear checkbox y mensaje de advertencia cada vez que se muestre
  const checkbox = document.getElementById("checkbox_modal");
  const advertencia = document.getElementById("advertencia_politica");
  if (checkbox) checkbox.checked = false;
  if (advertencia) {
    advertencia.style.display = "none";
    advertencia.textContent = "";
  }
}

document.getElementById("cruz").addEventListener("click", () => {
  document.getElementById("velo").style.display = "none";
});

// Escuchar el botón continuar UNA VEZ, asegurando que exista cuando se carga el script
const continuarBtn = document.getElementById("continuarBtn");
if (continuarBtn) {
  continuarBtn.addEventListener("click", () => {
    const checkbox = document.getElementById("checkbox_modal");
    const advertencia = document.getElementById("advertencia_politica");

    if (checkbox && checkbox.checked) {
      document.getElementById("velo").style.display = "none";
      // Aquí podrías redirigir si quieres, ejemplo:
      // window.location.href = "/home.html";
    } else {
      advertencia.textContent = "Debes aceptar las políticas de privacidad para continuar.";
      advertencia.style.display = "block";
    }
  });
} else {
  // Si el botón no existe aún (por ejemplo si el script corre antes de cargar el DOM), escucha después con DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("continuarBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        const checkbox = document.getElementById("checkbox_modal");
        const advertencia = document.getElementById("advertencia_politica");

        if (checkbox && checkbox.checked) {
          document.getElementById("velo").style.display = "none";
          // window.location.href = "/home.html";
        } else {
          advertencia.textContent = "Debes aceptar las políticas de privacidad para continuar.";
          advertencia.style.display = "block";
        }
      });
    }
  });
}







const velo = document.getElementById("velo");
const mensaje = document.getElementById("mensaje");
const cruz = document.getElementById("cruz");

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = $username.value.trim();
  const password = $password.value;
  const birthdate = $dob.value;

  const dob = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (age < 18) {
    alert("Debes ser mayor de 18 años para jugar.");
    return;
  }

  if (username === "" || password === "") {
    alert("Completa todos los campos.");
    return;
  }

  // Guardamos los datos en variables globales para usarlos luego
  window.registroDatos = { username, password, birthdate };

  mostrar_modal_politicas();
});

cruz.addEventListener("click", () => {
  velo.style.display = "none";
  limpiar_modal();
});

// Función para mostrar modal con checkbox y botón
function mostrar_modal_politicas() {
  mensaje.innerHTML = `
    <div><b>Por favor acepta las políticas de privacidad para continuar.</b></div>
    <div style="margin-top:10px;">
    
    <label>
        <input type="checkbox" id="checkbox_modal">
<a href="/html/politics.html" target="_blank" style="color:yellow; text-decoration:underline;">políticas de privacidad</a>
      </label>
    </div>
    <div style="margin-top:10px;">
      <button id="continuarBtn">Continuar</button>
    </div>
    <div id="advertencia_politica" style="color:red; margin-top:10px; display:none;"></div>
  `;

  velo.style.display = "flex";

  // Listener solo UNA VEZ para botón continuar en el modal
  document.getElementById("continuarBtn").onclick = async () => {
    const checkbox = document.getElementById("checkbox_modal");
    const advertencia = document.getElementById("advertencia_politica");

    if (!checkbox.checked) {
      advertencia.textContent = "Debes aceptar las políticas de privacidad para continuar.";
      advertencia.style.display = "block";
      return;
    }

    advertencia.style.display = "none";

    // Ya chequeado el checkbox, hacemos la llamada al servidor para registrar
    try {
      const { username, password, birthdate } = window.registroDatos;

const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, birthdate })
      });

      const result = await response.json();

      if (response.ok) {
        mensaje.innerHTML = `<b>Registro exitoso</b><div class='subtitulo'>¡Bienvenido/a!</div>`;
        setTimeout(() => {
          velo.style.display = "none";
          limpiar_modal();
          // Aquí redirigir si quieres:
          // window.location.href = "/home.html";
        }, 2000);
      } else {
        mensaje.innerHTML = `<b>Error:</b> ${result.message}`;
      }
    } catch (error) {
      mensaje.innerHTML = "<b>Error al conectar con el servidor</b>";
      console.error("Error en la solicitud:", error);
    }
  };
}

function limpiar_modal() {
  mensaje.innerHTML = "";
  delete window.registroDatos;
}

