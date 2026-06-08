// ==========================================
// BASE DE DATOS LOCAL CON LOS 3 USUARIOS SOLICITADOS
// ==========================================
if (!localStorage.getItem('usuarios_sgg')) {
    const defaultData = [
        { username: "usuario1", password: "clave2" },  // Número par (2) incluido
        { username: "usuario2", password: "passUser2" },
        { username: "usuario3", password: "passUser3" }
    ];
    localStorage.setItem('usuarios_sgg', JSON.stringify(defaultData));
}

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;

    // Resetear visualización del error
    loginError.textContent = "";
    loginError.style.display = "none";

    // Traer usuarios del localStorage
    const listadoUsuarios = JSON.parse(localStorage.getItem('usuarios_sgg'));

    // Buscar si existe el usuario ingresado
    const matchUser = listadoUsuarios.find(u => u.username === userInput);

    // Validación unificada para evitar dar pistas a atacantes
    if (!matchUser || matchUser.password !== passInput) {
        // Texto de error exacto solicitado
        loginError.textContent = "contraseña/usuario equivocado";
        loginError.style.display = "block";
        return;
    }

    // Si todo es correcto, guardamos la sesión e indicamos al navegador ir a dashboard.html
    localStorage.setItem('usuario_actual_sgg', matchUser.username);
    window.location.href = 'dashboard.html';
});
