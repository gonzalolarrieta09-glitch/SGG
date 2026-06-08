// ==========================================
// 1. ENGINE DEL MODO OSCURO (NATIVO E INTERACTIVO)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');

function aplicarTemaPremium(tema) {
    if (tema === 'dark') {
        document.body.classList.add('theme-dark');
        themeToggle.innerHTML = '☀️ Modo Día';
    } else {
        document.body.classList.remove('theme-dark');
        themeToggle.innerHTML = '🌙 Modo Noche';
    }
}

// Inicialización inteligente con preferencias de sistema/Google
const cachedTheme = localStorage.getItem('theme');
const systemDarkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (cachedTheme) {
    aplicarTemaPremium(cachedTheme);
} else if (systemDarkPref) {
    aplicarTemaPremium('dark');
}

// Evento de intercambio ágil (Click)
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    const nuevoTema = isDark ? 'light' : 'dark';
    aplicarTemaPremium(nuevoTema);
    localStorage.setItem('theme', nuevoTema);
});

// ==========================================
// 2. INTERRUPTOR DINÁMICO DE PANTALLAS (SINGLE-PAGE)
// ==========================================
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    // Ejecuta transición Pro animada de salida/entrada
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// ==========================================
// 3. BASE DE DATOS LOCALPERSISTENTE (LOCALSTORAGE)
// ==========================================
if (!localStorage.getItem('usuarios_sgg')) {
    const cuentaAdminPrevia = [
        { username: "admin", email: "admin@gmail.com", password: "password123", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin" }
    ];
    localStorage.setItem('usuarios_sgg', JSON.stringify(cuentaAdminPrevia));
}

function descargarUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_sgg'));
}

// ==========================================
// 4. GENERADOR Y BUSCADOR DE AVATARES GENÉRICOS
// ==========================================
const avatarContainer = document.getElementById('avatar-container');
const avatarSearch = document.getElementById('avatar-search');
const hiddenAvatarUrl = document.getElementById('selected-avatar-url');

const semillasAvatares = ["gato", "perro", "robot", "zorro", "oso", "buho", "gamer", "ninja", "astronauta", "fuego"];

function construirCatalogoAvatares(filtro = "") {
    avatarContainer.innerHTML = "";
    const filtrados = semillasAvatares.filter(s => s.includes(filtro.toLowerCase()));
    const listaDefinitiva = filtrados.length > 0 ? filtrados : ["misterio", "codigo"];

    listaDefinitiva.forEach((keyword, index) => {
        const linkConstruido = `https://api.dicebear.com/7.x/bottts/svg?seed=${keyword}`;
        const imgNode = document.createElement('img');
        imgNode.src = linkConstruido;
        imgNode.classList.add('avatar-item');
        imgNode.alt = `Avatar ${keyword}`;

        if (index === 0 && filtro === "") {
            imgNode.classList.add('selected');
            hiddenAvatarUrl.value = linkConstruido;
        }

        imgNode.addEventListener('click', () => {
            document.querySelectorAll('.avatar-item').forEach(el => el.classList.remove('selected'));
            imgNode.classList.add('selected');
            hiddenAvatarUrl.value = linkConstruido;
        });

        avatarContainer.appendChild(imgNode);
    });
}

avatarSearch.addEventListener('input', (e) => construirCatalogoAvatares(e.target.value));
construirCatalogoAvatares(); // Carga inicial limpia

// ==========================================
// 5. REGISTRO Y VALIDACIÓN DE DOMINIOS ADMITIDOS
// ==========================================
const registerForm = document.getElementById('register-form');
const regError = document.getElementById('reg-error-message');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-password').value;
    const avatar = hiddenAvatarUrl.value;

    regError.textContent = "";

    // Validación estricta solicitada
    const esGmail = email.endsWith('@gmail.com');
    const esYahoo = email.endsWith('@yahoo.com');
    const esYahoot = email.endsWith('@yahoot.com');

    if (!esGmail && !esYahoo && !esYahoot) {
        regError.textContent = "Error de Dominio: Solo se admiten correos @gmail.com, @yahoo.com o @yahoot.com";
        return;
    }

    const DB = descargarUsuarios();

    if (DB.some(u => u.username === user || u.email === email)) {
        regError.textContent = "Error: El nombre de usuario o correo ya existen en el sistema.";
        return;
    }

    // Inserción en memoria permanente
    DB.push({ username: user, email, password: pass, avatar });
    localStorage.setItem('usuarios_sgg', JSON.stringify(DB));

    alert("¡Cuenta Pro Creada! Iniciando tu sesión de forma automática...");

    // Auto-login al registrarse de forma exitosa
    localStorage.setItem('usuario_sesion_activa', JSON.stringify({ username: user, email, avatar }));
    location.reload(); 
});

// ==========================================
// 6. CONTROLADOR DE INICIO DE SESIÓN SEGURO
// ==========================================
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    loginError.textContent = "";
    const DB_Usuarios = descargarUsuarios();

    const cuentaEncontrada = DB_Usuarios.find(u => u.username === userInput || u.email === userInput);

    if (!cuentaEncontrada) {
        loginError.textContent = "Error: El usuario o correo no coinciden con nuestros registros.";
        return;
    }

    if (cuentaEncontrada.password !== passInput) {
        loginError.textContent = "Error: La contraseña ingresada es incorrecta.";
        return;
    }

    // Guardado de estado exitoso de la sesión
    localStorage.setItem('usuario_sesion_activa', JSON.stringify({
        username: cuentaEncontrada.username,
        email: cuentaEncontrada.email,
        avatar: cuentaEncontrada.avatar
    }));

    alert(`¡Bienvenido al SGG, ${cuentaEncontrada.username}! Sesión guardada.`);
    console.log("Sesión activa actual verificada:", JSON.parse(localStorage.getItem('usuario_sesion_activa')));
});
