// ==========================================
// 1. INICIALIZACIÓN DE USUARIOS CONFIGURADOS
// ==========================================
if (!localStorage.getItem('usuarios_sgg')) {
    const defaultData = [
        { username: "usuario1", password: "clave2" }, 
        { username: "usuario2", password: "secreta4" }
    ];
    localStorage.setItem('usuarios_sgg', JSON.stringify(defaultData));
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_sgg'));
}

// ==========================================
// 2. CONMUTADOR DE PANTALLAS (LOGIN / REGISTRO)
// ==========================================
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

// Inputs y contenedores de error para limpiarlos al cambiar de ventana
const loginError = document.getElementById('error-message');
const regError = document.getElementById('reg-error-message');

linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
    regError.style.display = "none";
});

linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    loginError.style.display = "none";
});

// ==========================================
// 3. LOGICA DE INICIO DE SESIÓN
// ==========================================
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    loginError.textContent = "";
    loginError.style.display = "none";

    const listado = obtenerUsuarios();
    const matchUser = listado.find(u => u.username === userInput);

    if (!matchUser || matchUser.password !== passInput) {
        // Mensaje de error solicitado
        loginError.textContent = "contraseña/usuario equivocado";
        loginError.style.display = "block";
        return;
    }

    localStorage.setItem('usuario_actual_sgg', matchUser.username);
    window.location.href = 'dashboard.html';
});

// ==========================================
// 4. LÓGICA DE REGISTRO CON VALIDACIÓN REQUERIDA
// ==========================================
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoUsuario = document.getElementById('reg-username').value.trim();
    const nuevaClave = document.getElementById('reg-password').value;

    regError.textContent = "";
    regError.style.display = "none";

    // --- REQUERIMIENTOS DE LA CONTRASEÑA ---
    const tieneMayuscula = /[A-Z]/.test(nuevaClave);
    const tieneNumero = /[0-9]/.test(nuevaClave);
    // Considera cualquier caracter que no sea letra o número como carácter especial
    const tieneCaracterEspecial = /[^A-Za-z0-9]/.test(nuevaClave); 

    if (!tieneMayuscula || !tieneNumero || !tieneCaracterEspecial) {
        regError.textContent = "La contraseña debe incluir al menos: 1 Mayúscula, 1 Número y 1 Carácter especial.";
        regError.style.display = "block";
        return;
    }

    const listado = obtenerUsuarios();

    // Validar que el nombre de usuario no esté tomado
    if (listado.some(u => u.username.toLowerCase() === nuevoUsuario.toLowerCase())) {
        regError.textContent = "El nombre de usuario ya se encuentra registrado.";
        regError.style.display = "block";
        return;
    }

    // Guardar nuevo usuario en la base de datos local
    listado.push({ username: nuevoUsuario, password: nuevaClave });
    localStorage.setItem('usuarios_sgg', JSON.stringify(listado));

    // Auto-login e ingreso al dashboard
    localStorage.setItem('usuario_actual_sgg', nuevoUsuario);
    window.location.href = 'dashboard.html';
});
