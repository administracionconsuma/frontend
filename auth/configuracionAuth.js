// Centraliza accesos, rutas y claves utilizadas por la capa de autenticación.
export const configuracionAuth = Object.freeze({
    rutas: Object.freeze({
        publica: '/consuma/publico/inicio.html',
        acceso: '/acceso/',
        administracion: '/consuma/administracion/inicio.html'
    }),

    roles: Object.freeze({
        administrador: 'ADMINISTRADOR'
    }),

    estados: Object.freeze({
        activo: 'ACTIVO',
        inactivo: 'INACTIVO'
    }),

    accesos: Object.freeze({
        publico: 'PUBLICO',
        administrador: 'ADMINISTRADOR'
    }),

    destino: Object.freeze({
        vigenciaMs: 60 * 60 * 1000,

        publicos: Object.freeze([
            '/consuma/publico/'
        ]),

        administracion: Object.freeze([
            '/consuma/administracion/'
        ]),

        excluidos: Object.freeze([
            '/acceso/',
            '/auth/'
        ])
    }),

    claves: Object.freeze({
        token: 'consuma:auth:access-token',
        venceEn: 'consuma:auth:vence-en',
        destinoDespuesDeLogin: 'consuma:auth:destino-despues-login'
    })
});
