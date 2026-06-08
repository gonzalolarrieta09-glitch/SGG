// ==========================================
// 1. ENGINE DEL MODO OSCURO (CLICK Y DETECCIÓN)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');

function mutarTemaColor(modo) {
    if (modo === 'dark') {
        document.body.classList.add('theme-dark');
        themeToggle.innerHTML = '☀️ Modo Claro';
    } else {
        document.body.classList.remove('theme-dark');
        themeToggle.innerHTML = '🌙 Modo Oscuro';
    }
}

const modoGuardado = localStorage.getItem('theme');
if (modoGuardado) {
    mutarTemaColor(modoGuardado);
}

themeToggle.addEventListener('click', () => {
    const esOscuro = document.body.classList.contains('theme-dark');
    const proximoTema = esOscuro ? 'light' : 'dark';
    mutarTemaColor(proximoTema);
    localStorage.setItem('theme', proximoTema);
});

// ==========================================
// 2. CONMUTADOR DE SECCIONES (SOLO UN FORMULARIO A LA VEZ)
// ==========================================
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const welcomeBox = document.getElementById('welcome-box');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');       // Oculta login por completo
    registerSection.classList.remove('hidden'); // Muestra registro
});

linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');    // Oculta registro por completo
    loginSection.classList.remove('hidden');    // Muestra login
});

// ==========================================
// 3. BASE DE DATOS LOCAL CON LOS 3 USUARIOS
// ==========================================
if (!localStorage.getItem('usuarios_sgg')) {
    const defaultData = [
        { username: "usuario1", email: "usuario1@gmail.com", password: "clave2", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gato" },
        { username: "usuario2", email: "usuario2@yahoo.com", password: "passUser2", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=robot" },
        { username: "usuario3", email: "usuario3@gmail.com", password: "passUser3", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ninja" }
    ];
    localStorage.setItem('usuarios_sgg', JSON.stringify(defaultData));
}

function leerDB() {
    return JSON.parse(localStorage.getItem('usuarios_sgg'));
}

// ==========================================
// 4. INICIO DE SESIÓN Y MENSAJE DE CONEXIÓN
// ==========================================
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('error-message');
const welcomeText = document.getElementById('welcome-text');
const btnLogout = document.getElementById('btn-logout');

function verificarSesionActiva() {
    const sesion = localStorage.getItem('usuario_sesion_activa');
    if (sesion) {
        const datosUser = JSON.parse(sesion);
        // Ocultar todos los formularios de acceso
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        
        // MOSTRAR MENSAJE SOLICITADO: usuario conectado, "hola (nombre del usuario)"
        welcomeText.innerHTML = `usuario conectado, <br>"hola ${datosUser.username}"`;
        welcomeBox.classList.remove('hidden');
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    loginError.textContent = "";
    const listado = leerDB();

    const matchUser = listado.find(u => u.username === userInput || u.email === userInput);

    if (!matchUser || matchUser.password !== passInput) {
        loginError.textContent = "Error: Credenciales incorrectas.";
        return;
    }

    // Guardar cuenta activa en localStorage
    localStorage.setItem('usuario_sesion_activa', JSON.stringify({
        username: matchUser.username,
        email: matchUser.email
    }));

    // Actualizar visualización de la interfaz en caliente
    verificarSesionActiva();
});

// Cerrar sesión para volver a probar
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuario_sesion_activa');
    welcomeBox.classList.add('hidden');
    loginSection.classList.remove('hidden');
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
});

// ==========================================
// 5. MANEJO DE REGISTRO DE CUENTAS NUEVAS
// ==========================================
const registerForm = document.getElementById('register-form');
const regError = document.getElementById('reg-error-message');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-password').value;
    const avatar = document.getElementById('selected-avatar-url').value;

    regError.textContent = "";

    const valido = email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@yahoot.com');
    if (!valido) {
        regError.textContent = "Error: El correo debe ser @gmail.com o @yahoo.com.";
        return;
    }

    const baseUsuarios = leerDB();
    if (baseUsuarios.some(u => u.username === user || u.email === email)) {
        regError.textContent = "Error: Este usuario o correo ya existe.";
        return;
    }

    baseUsuarios.push({ username: user, email, password: pass, avatar });
    localStorage.setItem('usuarios_sgg', JSON.stringify(baseUsuarios));

    localStorage.setItem('usuario_sesion_activa', JSON.stringify({ username: user, email }));
    verificarSesionActiva();
});

// Carga del motor de avatares rápido para evitar vacíos
const avatarContainer = document.getElementById('avatar-container');
const coleccion = ["gato", "perro", "robot", "ninja"];
coleccion.forEach(key => {
    const img = document.createElement('img');
    img.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${key}`;
    img.classList.add('avatar-item');
    img.addEventListener('click', () => {
        document.querySelectorAll('.avatar-item').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        document.getElementById('selected-avatar-url').value = img.src;
    });
    avatarContainer.appendChild(img);
});

// Ejecución al iniciar la página
verificarSesionActiva();
