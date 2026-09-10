// Configura el contenido y comportamiento visual del encabezado global.
export function configurarEncabezado(
    elemento,
    {
        logo = null,
        nombre = '',
        subtitulo = '',
        navegacion = [],
        usuario = null,
        alCerrarSesion = null
    } = {}
) {
    if (!(elemento instanceof HTMLElement)) {
        throw new TypeError(
            'El encabezado requiere un elemento HTML válido.'
        );
    }

    const logoElemento =
        elemento.querySelector(
            '[data-encabezado-logo]'
        );

    const nombreElemento =
        elemento.querySelector(
            '[data-encabezado-nombre]'
        );

    const subtituloElemento =
        elemento.querySelector(
            '[data-encabezado-subtitulo]'
        );

    const navegacionElemento =
        elemento.querySelector(
            '[data-encabezado-navegacion]'
        );

    const usuarioElemento =
        elemento.querySelector(
            '.encabezado-usuario'
        );

    if (
        !logoElemento ||
        !nombreElemento ||
        !subtituloElemento ||
        !navegacionElemento
    ) {
        throw new Error(
            'El encabezado no contiene todos los elementos requeridos.'
        );
    }

    configurarIdentidad({
        logoElemento,
        nombreElemento,
        subtituloElemento,
        logo,
        nombre,
        subtitulo
    });

    configurarNavegacion(
        navegacionElemento,
        navegacion
    );

    /*
        El bloque de usuario es opcional.

        Administración entrega un usuario y conserva exactamente
        el comportamiento actual.

        Las vistas públicas no entregan usuario, por lo que el bloque
        completo se oculta y no se configura.
    */
    if (!usuario) {
        if (usuarioElemento) {
            usuarioElemento.style.display =
                'none';
        }

        return;
    }

    if (!usuarioElemento) {
        throw new Error(
            'El encabezado no contiene el bloque de usuario requerido.'
        );
    }

    usuarioElemento.style.removeProperty(
        'display'
    );

    const botonUsuario =
        usuarioElemento.querySelector(
            '[data-encabezado-usuario-boton]'
        );

    const avatarElemento =
        usuarioElemento.querySelector(
            '[data-encabezado-avatar]'
        );

    const nombreUsuarioElemento =
        usuarioElemento.querySelector(
            '[data-encabezado-usuario-nombre]'
        );

    const menuElemento =
        usuarioElemento.querySelector(
            '[data-encabezado-menu]'
        );

    const botonCerrarSesion =
        usuarioElemento.querySelector(
            '[data-encabezado-cerrar-sesion]'
        );

    if (
        !botonUsuario ||
        !avatarElemento ||
        !nombreUsuarioElemento ||
        !menuElemento ||
        !botonCerrarSesion
    ) {
        throw new Error(
            'El encabezado no contiene todos los elementos de usuario requeridos.'
        );
    }

    configurarUsuario({
        botonUsuario,
        avatarElemento,
        nombreUsuarioElemento,
        menuElemento,
        botonCerrarSesion,
        usuario,
        alCerrarSesion
    });
}


// Actualiza únicamente el subtítulo de contexto de la página actual.
export function actualizarSubtituloEncabezado(
    elemento,
    subtitulo = ''
) {
    const subtituloElemento =
        elemento?.querySelector(
            '[data-encabezado-subtitulo]'
        );

    if (!subtituloElemento) {
        return;
    }

    subtituloElemento.textContent =
        subtitulo;
}


// Actualiza únicamente la navegación recibida por el encabezado.
export function actualizarNavegacionEncabezado(
    elemento,
    navegacion = []
) {
    const navegacionElemento =
        elemento?.querySelector(
            '[data-encabezado-navegacion]'
        );

    if (!navegacionElemento) {
        return;
    }

    configurarNavegacion(
        navegacionElemento,
        navegacion
    );
}


// Aplica logo, nombre y subtítulo sin conocer el origen de esos datos.
function configurarIdentidad({
                                 logoElemento,
                                 nombreElemento,
                                 subtituloElemento,
                                 logo,
                                 nombre,
                                 subtitulo
                             }) {
    nombreElemento.textContent =
        nombre;

    subtituloElemento.textContent =
        subtitulo;

    if (logo?.src) {
        logoElemento.src =
            logo.src;

        logoElemento.alt =
            logo.alt ||
            nombre ||
            '';

        logoElemento.hidden =
            false;

        return;
    }

    logoElemento.removeAttribute(
        'src'
    );

    logoElemento.alt =
        '';

    logoElemento.hidden =
        true;
}


// Renderiza únicamente las opciones de navegación que recibe desde afuera.
function configurarNavegacion(
    contenedor,
    navegacion
) {
    contenedor.replaceChildren();

    if (!Array.isArray(navegacion)) {
        return;
    }

    navegacion.forEach(
        (opcion) => {
            if (
                !opcion ||
                typeof opcion !== 'object'
            ) {
                return;
            }

            const enlace =
                document.createElement(
                    'a'
                );

            enlace.className =
                'encabezado-navegacion-enlace';

            enlace.textContent =
                opcion.etiqueta ||
                '';

            enlace.href =
                opcion.href ||
                '#';

            if (opcion.actual) {
                enlace.setAttribute(
                    'aria-current',
                    'page'
                );
            }

            contenedor.appendChild(
                enlace
            );
        }
    );
}


// Configura avatar, nombre y desplegable sin conocer la sesión ni el backend.
function configurarUsuario({
                               botonUsuario,
                               avatarElemento,
                               nombreUsuarioElemento,
                               menuElemento,
                               botonCerrarSesion,
                               usuario,
                               alCerrarSesion
                           }) {
    nombreUsuarioElemento.textContent =
        usuario?.nombre ||
        '';

    avatarElemento.textContent =
        obtenerIniciales(
            usuario?.nombre ||
            ''
        );

    botonUsuario.addEventListener(
        'click',
        () => {
            const abierto =
                botonUsuario.getAttribute(
                    'aria-expanded'
                ) === 'true';

            establecerMenuAbierto({
                botonUsuario,
                menuElemento,
                abierto:
                    !abierto
            });
        }
    );

    botonCerrarSesion.addEventListener(
        'click',
        async () => {
            establecerMenuAbierto({
                botonUsuario,
                menuElemento,
                abierto:
                    false
            });

            if (
                typeof alCerrarSesion ===
                'function'
            ) {
                await alCerrarSesion();
            }
        }
    );

    document.addEventListener(
        'click',
        (evento) => {
            if (
                elementoContieneObjetivo(
                    botonUsuario,
                    menuElemento,
                    evento.target
                )
            ) {
                return;
            }

            establecerMenuAbierto({
                botonUsuario,
                menuElemento,
                abierto:
                    false
            });
        }
    );

    document.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key !==
                'Escape'
            ) {
                return;
            }

            establecerMenuAbierto({
                botonUsuario,
                menuElemento,
                abierto:
                    false
            });

            botonUsuario.focus();
        }
    );
}


// Mantiene sincronizados el atributo ARIA y la visibilidad del menú.
function establecerMenuAbierto({
                                   botonUsuario,
                                   menuElemento,
                                   abierto
                               }) {
    botonUsuario.setAttribute(
        'aria-expanded',
        String(abierto)
    );

    menuElemento.hidden =
        !abierto;
}


// Determina si un clic ocurrió dentro del control o su desplegable.
function elementoContieneObjetivo(
    botonUsuario,
    menuElemento,
    objetivo
) {
    return botonUsuario.contains(
            objetivo
        ) ||
        menuElemento.contains(
            objetivo
        );
}


// Genera hasta dos iniciales para el avatar visual.
function obtenerIniciales(
    nombre
) {
    return String(
        nombre
    )
        .trim()
        .split(
            /\s+/
        )
        .filter(
            Boolean
        )
        .slice(
            0,
            2
        )
        .map(
            (parte) =>
                parte
                    .charAt(0)
                    .toUpperCase()
        )
        .join('');
}