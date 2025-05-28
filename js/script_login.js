
    // Mostrar u ocultar contraseña
    document.getElementById("visible").addEventListener("change", function () {
      const passwordInput = document.getElementById("password");
      passwordInput.type = this.checked ? "text" : "password";
    });

    // Manejo del formulario de inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          alert("Inicio de sesión exitoso!");
          window.location.href = "home.html";
        } else {
          alert(data.message || "Credenciales incorrectas");
        }
      } catch (error) {
        console.error(error);
        alert("Error de inicio de sesión");
      }
    });
