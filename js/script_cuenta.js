
    // Aplicar modo claro si está activado
    const temaGuardado = localStorage.getItem("theme");
    if (temaGuardado === "light") {
document.documentElement.setAttribute("data-theme", "light");

    }

    // Obtener datos de cuenta
    const token = localStorage.getItem("token");
fetch("/api/cuenta", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Respuesta no válida");
      return res.json();
    })
    .then(data => {
      document.getElementById("username").value = data.username;
      document.getElementById("birthdate").value = data.birthdate.slice(0, 10);
      document.getElementById("puntaje").value = data.score;
      document.getElementById("created_at").value = new Date(data.created_at).toLocaleDateString();
    })
    .catch(err => {
      console.error("Error:", err);
      alert("No se pudo cargar la cuenta");
    });
