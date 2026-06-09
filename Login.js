// Las 2 cuentas pregeneradas solicitadas
const cuentasValidas = {
    "usuario1": "clave123",
    "admin": "admin2026"
};

function validarLogin(event) {
    // CONSERVA la información en los inputs evitando que la página se recargue
    event.preventDefault(); 

    const usuarioIngresado = document.getElementById('username').value.trim();
    const contrasenaIngresada = document.getElementById('password').value;
    const mensajeDiv = document.getElementById('mensajeResultado');

    // Validación estricta que se ejecuta solo al presionar el botón
    if (cuentasValidas[usuarioIngresado] && cuentasValidas[usuarioIngresado] === contrasenaIngresada) {
        // Mensaje exacto solicitado en caso de éxito
        mensajeDiv.textContent = "Felicidades su cuenta se conectó perfectamente";
        mensajeDiv.className = "message success";
    } else {
        // Mensaje en caso de error
        mensajeDiv.textContent = "Usuario o contraseña incorrectos.";
        mensajeDiv.className = "message error";
    }
}
