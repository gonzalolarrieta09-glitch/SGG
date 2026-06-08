// ==========================================
// 1. INTERRUPTOR DE MODO OSCURO CON UN CLIC
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

// Carga inicial (lee la caché de la cuenta o el sistema)
const modoGuardado = localStorage.getItem('theme');
const prefiereOscuroSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (modoGuardado) {
    mutarTemaColor(modoGuardado);
} else if (prefiereOscuroSistema) {
    mutarTemaColor('dark');
}

// Cambiar de modo al hacer un clic en el botón superior
themeToggle.addEventListener('click', () => {
    const esOscuro = document.body.classList.contains('theme-dark');
    const proximoTema = esOscuro ? 'light' : 'dark';
    mutarTemaColor(proximoTema);
    localStorage.setItem('theme', proximoTema);
});

// ==========================================
// 2. CONMUTADOR DE SECCIONES (SIN CAMBIAR DE PÁGINA)
// ==========================================
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// ==========================================
// 3. BASE DE DATOS LOCAL Y MOTOR DE AVATARES
// ==========================================
if (!localStorage.getItem('usuarios_sgg')) {
    const defaultData = [
        { username: "admin", email: "admin@gmail.com", password: "password123", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin" }
    ];
    localStorage.setItem('usuarios_sgg', JSON.stringify(defaultData));
}

function leerDB() {
    return JSON.parse(localStorage.getItem('usuarios_sgg'));
}

const avatarContainer = document.getElementById('avatar-container');
const avatarSearch = document.getElementById('avatar-search');
const hiddenAvatarUrl = document.getElementById('selected-avatar-url');

const coleccionAvatares = ["gato", "perro", "robot", "zorro", "oso", "buho", "gamer", "ninja", "astronauta", "fuego"];

function crearGaleriaAvatares(filtro = "") {
    avatarContainer.innerHTML = "";
    const filtrados = coleccionAvatares.filter(s => s.includes(filtro.toLowerCase()));
    const finalLista = filtrados.length > 0 ? filtrados : ["misterio"];

    finalLista.forEach((key, index) => {
        const link = `https://api.dicebear.com/7.x/bottts/svg?seed=${key}`;
        const img = document.createElement('img');
        img.src = link;
        img.classList.add('avatar-item');
        img.alt = key;

        if (index === 0 && filtro === "") {
            img.classList.add('selected');
            hiddenAvatarUrl.value = link;
        }

        img.addEventListener('click', () => {
            document.querySelectorAll('.avatar-item').forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
            hiddenAvatarUrl.value = link;
        });

        avatarContainer.appendChild(img);
    });
}

avatarSearch.addEventListener('input', (e) => crearGaleriaAvatares(e.target.value));
crearGaleriaAvatares();

// ==========================================
// 4. ENVÍO DE REGISTRO CON FILTRO DE CORREO SOLICITADO
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

    // Validación estricta de dominios admitidos
    const valido = email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || email.endsWith('@yahoot.com');

    if (!valido) {
        regError.textContent = "Error: El correo electrónico obligatorio debe ser @gmail.com o @yahoo.com.";
        return;
    }

    const baseUsuarios = leerDB();

    if (baseUsuarios.some(u => u.username === user || u.email === email)) {
        regError.textContent = "Error: Este usuario o correo ya se encuentra registrado.";
        return;
    }

    baseUsuarios.push({ username: user, email, password: pass, avatar });
    localStorage.setItem('usuarios_sgg', JSON.stringify(baseUsuarios));

    alert("¡Cuenta Creada! Iniciando sesión de forma automática...");
    
    // Auto-login instantáneo al registrarse con éxito
    localStorage.setItem('usuario_sesion_activa', JSON.stringify({ username: user, email, avatar }));
    location.reload();
});

// ==========================================
// 5. INICIO DE SESIÓN Y GUARDADO DE CUENTA
// ==========================================
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    loginError.textContent = "";
    const listado = leerDB();

    const matchUser = listado.find(u => u.username === userInput || u.email === userInput);

    if (!matchUser) {
        loginError.textContent = "Error: Credenciales inválidas o no registradas.";
        return;
    }

    if (matchUser.password !== passInput) {
        loginError.textContent = "Error: La contraseña es incorrecta.";
        return;
    }

    // SE GUARDA LA CUENTA UNA VEZ SE INICIA SESIÓN
    localStorage.setItem('usuario_sesion_activa', JSON.stringify({
        username: matchUser.username,
        email: matchUser.email,
        avatar: matchUser.avatar
    }));

    alert(`¡Sesión Guardada! Bienvenido/a, ${matchUser.username}.`);
    console.log("Sesión activa recuperada del LocalStorage:", JSON.parse(localStorage.getItem('usuario_sesion_activa')));
});