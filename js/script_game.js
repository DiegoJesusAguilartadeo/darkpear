window.onload = inicio;
let reintentosDisponibles = 5;
const botonReintentar = document.getElementById("reintentar");
const mostrarIntentos = document.getElementById("reintentos-restantes");

var credito = 5;
var puntaje = 0;
var probabilidad_ganar = 0.1; // 10% al inicio
var aumento_por_fallo = 0.05; // aumenta 5% por cada pérdida
var probabilidad_maxima = 0.5; // no sobrepasa 50%

var imagenes_sesgadas = [
    "papum.png", "papum.png", "papum.png", "papum.png", "papum.png", "papum.png",
    "girasol2.png", "girasol2.png", "girasol2.png", "girasol2.png", "girasol2.png",
    "planta1.png", "planta1.png", "planta1.png", "planta1.png",
    "pera pvz.png", "pera pvz.png", "pera pvz.png",
    "cact.png", "cact.png", "cact.png",
    "imitadora2.png", "imitadora2.png",
    "jet.png", "jet.png",
    "cabeza2.png"
];

var premios_por_imagen = {
    "papum.png": 2,
    "girasol2.png": 2, 
    "planta1.png": 2,
    "pera pvz.png": 4,
    "cact.png": 6,
    "imitadora2.png": 6,
    "jet.png": 12,
    "cabeza2.png": 0
};

var numeros_actuales = [];
var au;
var activos = false;

function inicio() {
    document.getElementById("tirar").onclick = Lanzar_inicio;
    document.getElementById("cruz").onclick = cerrar;
    au = document.getElementById("sonido");

    // Obtener intentos disponibles del servidor
    fetch("/api/cuenta", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {
        reintentosDisponibles = data.intentos_disponibles || 0;
        mostrarIntentos.innerText = `Intentos restantes: ${reintentosDisponibles}`;

        if (reintentosDisponibles <= 0) {
            botonReintentar.hidden = false;
            botonReintentar.disabled = true;
            botonReintentar.innerText = "Sin intentos";
        }
    })
    .catch(err => {
        console.error("Error obteniendo intentos:", err);
        mostrarIntentos.innerText = "Intentos no disponibles";
    });

    actualizar();
}

function Lanzar_inicio() {
    const botonTirar = document.getElementById("tirar");

    if (reintentosDisponibles <= 0) {
        mostrar_mensaje("<b>No puedes jugar más</b><div class='subtitulo'>Has agotado tus intentos</div>");
        botonReintentar.hidden = false;
        botonReintentar.disabled = true;
        botonReintentar.innerText = "Sin intentos";
        mostrarIntentos.innerText = "Intentos agotados";
        botonTirar.hidden = true; // Oculta el botón de tirar si no hay intentos
        return;
    }

    // 🚫 Nueva validación para evitar crédito negativo o múltiples tiradas
    if (credito <= 0 || activos) {
        botonTirar.disabled = true;
        return;
    }

    botonTirar.disabled = true;
    sonar("Lanzar.mp3");
    activos = true;
    numeros_actuales = [];

    let hubo_ganador = false;

    if (Math.random() < probabilidad_ganar) {
        
        let opciones_comunes = ["papum.png", "planta1.png", "pera pvz.png", "girasol2.png", "cact.png","cabeza2.png"];
        let img = opciones_comunes[Math.floor(Math.random() * opciones_comunes.length)];
        numeros_actuales = [img, img, img];
        hubo_ganador = true;
    } else {
        for (let k = 0; k < 3; k++) {
            let img = escoger_imagen();
            numeros_actuales.push(img);
        }
    }

    for (let k = 0; k < 3; k++) {
        mostrar_imagen(k, numeros_actuales[k]);
    }

    setTimeout(() => {
        if (comparar()) {
            probabilidad_ganar = 0.1;
        } else {
            probabilidad_ganar += aumento_por_fallo;
            if (probabilidad_ganar > probabilidad_maxima) {
                probabilidad_ganar = probabilidad_maxima;
            }
        }

        // ✅ Rehabilita el botón después de terminar todo
        botonTirar.disabled = false;

        // Oculta el botón si ya no hay crédito
        if (credito <= 0) {
            botonTirar.hidden = true;
        }

        activos = false;

    }, 1000 + 600);
}



function escoger_imagen() {
    let index = Math.floor(Math.random() * imagenes_sesgadas.length);
    return imagenes_sesgadas[index];
}

function mostrar_imagen(num, imagen) {
    const contenedor = document.getElementsByClassName("imagen")[num];
    const img = contenedor.getElementsByTagName("img")[0];

    // Limpiar clases previas si existen
    img.classList.remove("girando");

    // Retardo escalonado: 0ms, 200ms, 400ms para cada imagen
    setTimeout(() => {
        img.classList.add("girando");
        img.src = "img/" + imagen;

        // Quitar la animación después de que termine (coincide con duración CSS)
        setTimeout(() => {
            img.classList.remove("girando");
        }, 600);
    }, num * 200); // Escalado por posición
}

function comparar() {
    // 🚫 Validación reforzada para evitar restar crédito si ya no hay
    if (credito <= 0) {
        mostrar_mensaje("<b>Sin crédito</b><div class='subtitulo'>No puedes jugar sin monedas</div>");
        document.getElementById("tirar").hidden = true;
        return false;
    }

    if (
        numeros_actuales[0] === numeros_actuales[1] &&
        numeros_actuales[1] === numeros_actuales[2]
    ) {
        activos = false;
        let img = numeros_actuales[0];
        let premio = premios_por_imagen[img] || 0;
        let mensaje = `¡Has ganado ${premio} monedas!<div>`;
        for (let k = 0; k < premio; k++) {
            mensaje += `<img src="img/coin.png">`;
        }
        mensaje += `</div>`;
        generarMonedasAnimadas(premio);
        mostrar_mensaje(mensaje);
        sonar("ganar.mp3");
        credito += premio;

        puntaje += premio;

        // ✅ Validación antes de restar el crédito
        if (credito > 0) {
            credito--; // costo de tirada
           
        }

        actualizar();
        return true;
    }

    // ✅ Validación antes de restar el crédito en caso de perder
    if (credito > 0) {
        credito--; // costo de tirada
        
    }

    actualizar();
    return false;
}


function actualizar() {
    document.getElementById("dinero").innerHTML = credito;
    const dineroElemento = document.getElementById("dinero");
    dineroElemento.classList.add("cambio"); 
    setTimeout(() => {
        dineroElemento.classList.remove("cambio");
    }, 300);

    document.getElementById("puntaje").innerHTML = puntaje;
    document.getElementById("monedas").innerHTML = "";
    for (let k = 1; k <= credito; k++) {
        document.getElementById("monedas").innerHTML += `<img src="img/coin.png">`;
    }

    //  Nuevo: Solo descuenta el intento cuando el crédito llegue a 0
    if (credito === 0) {
         sonar("perder.mp3");
         mostrar_mensaje("<b>Has perdido todas tus monedas</b><div class='subtitulo'>Se descontará un intento</div>");


        reintentosDisponibles--;
        mostrarIntentos.innerText = `Intentos restantes: ${reintentosDisponibles}`;

        fetch("/registrar-partida", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                puntaje: puntaje,
                intentos_usados: 1 // ahora solo 1 intento por ronda de 5 monedas
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "No tienes más intentos disponibles" || reintentosDisponibles <= 0) {
                reintentosDisponibles = 0;
                mostrar_mensaje("<b>No puedes jugar más</b><div class='subtitulo'>Has agotado tus intentos</div>");
                botonReintentar.hidden = false;
                botonReintentar.disabled = true;
                botonReintentar.innerText = "Sin intentos";
                mostrarIntentos.innerText = `Intentos agotados`;
            } else {
                // Actualiza desde el backend
                fetch("/api/cuenta", {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                })
                .then(res => res.json())
                .then(userData => {
                    reintentosDisponibles = userData.intentos_disponibles || 0;
                    mostrarIntentos.innerText = `Intentos restantes: ${reintentosDisponibles}`;
                    botonReintentar.hidden = false;
                    botonReintentar.disabled = reintentosDisponibles <= 0;
                    botonReintentar.innerText = reintentosDisponibles > 0 ? "Reintentar" : "Sin intentos";
                });
            }
        })
        .catch(err => console.error("Error registrando partida:", err));
    }
}




function mostrar_mensaje(m) {
    const mensaje = document.getElementById("mensaje");
    mensaje.innerHTML = m;

    // Reinicia animación
    mensaje.style.animation = "none";
    mensaje.offsetHeight; // fuerza reflow
    mensaje.style.animation = "entradaMensaje 0.6s ease-out forwards";

    document.getElementById("velo").style.display = "flex";
}

function cerrar() {
    document.getElementById("velo").style.display = "none";
    au.pause();
}

function sonar(audio) {
    au.src = "audio/" + audio;
    au.play();
}

botonReintentar.addEventListener("click", () => {
    if (reintentosDisponibles > 0) {
        // Reiniciar juego sin volver a descontar
        credito = 5;
        probabilidad_ganar = 0.1;

        actualizar();
        cerrar();

        botonReintentar.hidden = true;
        botonReintentar.disabled = true;
        mostrarIntentos.innerText = `Intentos restantes: ${reintentosDisponibles}`;
    }

    if (reintentosDisponibles <= 0) {
        botonReintentar.innerText = "Sin intentos";
        mostrarIntentos.innerText = "Intentos agotados";
        botonReintentar.disabled = true;
    }
});

function salirDelJuego() {
    // Solo registrar si hay algo que guardar
    if (credito < 5 || puntaje > 0) {
        fetch("/registrar-partida", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                puntaje: puntaje,
                intentos_usados: 1 // por cada ronda de 5 créditos
            })
        })
        .then(res => res.json())
        .then(() => {
            // Llama a la ruta /obt después de registrar la partida
            return fetch("/obt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
        })
        .then(() => {
            window.location.href = "home.html";
        })
        .catch(err => {
            console.error("Error al salir:", err);
            window.location.href = "home.html"; // Igual redirige
        });
    } else {
        window.location.href = "home.html";
    }
}

document.getElementById("salir").addEventListener("click", salirDelJuego);


function generarMonedasAnimadas(cantidad) {
    const contenedor = document.getElementById("animacion-monedas");
    contenedor.innerHTML = ""; // limpiar anteriores

    for (let i = 0; i < cantidad; i++) {
        const moneda = document.createElement("div");
        moneda.classList.add("moneda-animada");
        moneda.style.left = Math.random() * 80 + 10 + "%";
        moneda.style.animationDelay = (i * 0.1) + "s";
        contenedor.appendChild(moneda);
    }

    // Asegura que se muestre el velo y cuadro
    document.getElementById("velo").style.display = "flex";
}
