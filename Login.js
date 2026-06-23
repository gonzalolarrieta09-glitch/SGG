// Inicializar tus 2 cuentas válidas originales si no existen en el almacenamiento
if (!localStorage.getItem("cuentasSGG")) {
    const cuentasIniciales = {
        usuario1: "clave123",
        admin: "admin2026"
    };
    localStorage.setItem("cuentasSGG", JSON.stringify(cuentasIniciales));
}

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const mensajeDiv = document.getElementById("mensajeResultado");
    const themeToggle = document.getElementById("themeToggle");

    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const btnIrARegistro = document.getElementById("btnIrARegistro");
    const btnIrALogin = document.getElementById("btnIrALogin");

    // Aplicar tema guardado (Tu lógica original)
    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "oscuro") {
        document.body.classList.add("dark-mode");
    }

    // Cambio de tema (Tu lógica original)
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("tema", "oscuro");
                themeToggle.textContent = "☀️ Tema claro";
            } else {
                localStorage.setItem("tema", "claro");
                themeToggle.textContent = "🌙 Tema oscuro";
            }

        });

        // Texto inicial del botón (Tu lógica original)
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️ Tema claro";
        } else {
            themeToggle.textContent = "🌙 Tema oscuro";
        }
    }

    // Navegación interna entre Login y Registro
    btnIrARegistro.addEventListener("click", (e) => {
        e.preventDefault();
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
        mensajeDiv.textContent = "";
        mensajeDiv.className = "message";
    });

    btnIrALogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        mensajeDiv.textContent = "";
        mensajeDiv.className = "message";
    });

    // Inicio de sesión (Tu lógica original adaptada al almacenamiento dinámico)
    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const usuario = document.getElementById("username").value.trim();
        const contraseña = document.getElementById("password").value;

        mensajeDiv.className = "message";

        // Obtener el listado actualizado de cuentas
        const cuentasValidas = JSON.parse(localStorage.getItem("cuentasSGG"));

        if (!cuentasValidas[usuario]) {

            mensajeDiv.textContent = "❌ Usuario no registrado.";
            mensajeDiv.classList.add("error");

        } else if (cuentasValidas[usuario] === contraseña) {

            mensajeDiv.textContent = "✅ Inicio de sesión correcto.";
            mensajeDiv.classList.add("success");

        } else {

            mensajeDiv.textContent = "❌ Contraseña incorrecta.";
            mensajeDiv.classList.add("error");

        }

    });

    // Lógica del nuevo formulario de Registro con las 4 validaciones estrictas
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nuevoUsuario = document.getElementById("regUsername").value.trim();
        const nuevaContraseña = document.getElementById("regPassword").value;

        mensajeDiv.className = "message";

        // --- VALIDACIONES REQUERIDAS DE LA CONTRASEÑA ---
        const tieneMayuscula = /[A-Z]/.test(nuevaContraseña);
        const tieneMinuscula = /[a-z]/.test(nuevaContraseña);
        const tieneNumero = /[0-9]/.test(nuevaContraseña);
        const tieneEspecial = /[^A-Za-z0-9]/.test(nuevaContraseña); // Detecta símbolos/caracteres especiales

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial) {
            mensajeDiv.textContent = "❌ La contraseña requiere: 1 Mayúscula, 1 Minúscula, 1 Número y 1 Carácter especial.";
            mensajeDiv.classList.add("error");
            return;
        }

        const cuentasValidas = JSON.parse(localStorage.getItem("cuentasSGG"));

        // Validar si el usuario ya existe
        if (cuentasValidas[nuevoUsuario]) {
            mensajeDiv.textContent = "❌ El nombre de usuario ya está registrado.";
            mensajeDiv.classList.add("error");
            return;
        }

        // Registrar y guardar la nueva cuenta
        cuentasValidas[nuevoUsuario] = nuevaContraseña;
        localStorage.setItem("cuentasSGG", JSON.stringify(cuentasValidas));

        mensajeDiv.textContent = "✅ Usuario registrado con éxito. Ya puedes iniciar sesión.";
        mensajeDiv.classList.add("success");

        // Limpiar formulario y regresar al login automáticamente tras 2 segundos
        registerForm.reset();
        setTimeout(() => {
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
            mensajeDiv.textContent = "";
            mensajeDiv.className = "message";
        }, 2200);
    });

});
