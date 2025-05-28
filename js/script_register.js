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

document.getElementById("loginForm").addEventListener("submit", async (e) => {
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

    if (username !== "" && password !== "") {
        try {
            const response = await fetch("http://localhost:3000/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, birthdate })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                 // Redireccionar después del login
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error al conectar con el servidor");
        }
    }
});