import { inicializarApp } from '../app/index.js';
import { autenticar } from '../auth/index.js';

// Inicializa la infraestructura transversal antes de usar autenticación.
inicializarApp();

const formulario = document.querySelector('#formulario-acceso');
const campoCorreo = document.querySelector('#correo');
const campoPassword = document.querySelector('#password');
const mensaje = document.querySelector('#mensaje-acceso');
const boton = document.querySelector('#boton-acceso');

if (!formulario || !campoCorreo || !campoPassword || !mensaje || !boton) {
    throw new Error('La página de acceso no contiene todos los elementos requeridos.');
}

formulario.addEventListener('submit', manejarEnvio);

// Autentica al administrador y, si es válido, lo dirige al área administrativa.
async function manejarEnvio(evento) {
    evento.preventDefault();
    limpiarMensaje();

    const correo = campoCorreo.value.trim();
    const password = campoPassword.value;

    if (!correo || !password) {
        mostrarMensaje('Completá el correo y la contraseña.');
        return;
    }

    establecerProcesando(true);

    try {
        const usuario = await autenticar({
            correo,
            password
        });

        if (
            !usuario
            || usuario.rol !== 'ADMINISTRADOR'
            || usuario.estado !== 'ACTIVO'
        ) {
            mostrarMensaje('Tu usuario no tiene acceso administrativo.');
            return;
        }

        window.location.replace('../consuma/administracion/inicio.html');
    } catch (error) {
        mostrarMensaje(
            error?.mensaje
            || error?.message
            || 'No fue posible iniciar sesión.'
        );
    } finally {
        establecerProcesando(false);
    }
}

// Actualiza el estado visual del formulario durante la autenticación.
function establecerProcesando(procesando) {
    boton.disabled = procesando;
    campoCorreo.disabled = procesando;
    campoPassword.disabled = procesando;
    boton.textContent = procesando ? 'Ingresando...' : 'Ingresar';
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}

function limpiarMensaje() {
    mensaje.textContent = '';
}
