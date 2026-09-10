// Centraliza las rutas HTTP conocidas del backend Recetario API.

const BASE_AUTENTICACION = '/api/v1/autenticacion';
const BASE_ADMINISTRACION = '/api/v1/administracion';
const BASE_PUBLICO = '/api/v1/publico';

export const RUTAS_API = Object.freeze({
    autenticacion: Object.freeze({
        login: `${BASE_AUTENTICACION}/login`,
        usuarioActual: `${BASE_AUTENTICACION}/usuario-actual`
    }),

    administracion: Object.freeze({
        usuarios: `${BASE_ADMINISTRACION}/usuarios`,
        usuarioPorId: (id) => `${BASE_ADMINISTRACION}/usuarios/${id}`,
        estadoUsuario: (id) => `${BASE_ADMINISTRACION}/usuarios/${id}/estado`,

        insumos: `${BASE_ADMINISTRACION}/insumos`,
        insumoPorId: (id) => `${BASE_ADMINISTRACION}/insumos/${id}`,
        estadoInsumo: (id) => `${BASE_ADMINISTRACION}/insumos/${id}/estado`,

        categorias: `${BASE_ADMINISTRACION}/categorias`,
        categoriaPorId: (id) => `${BASE_ADMINISTRACION}/categorias/${id}`,
        estadoCategoria: (id) => `${BASE_ADMINISTRACION}/categorias/${id}/estado`,

        recetas: `${BASE_ADMINISTRACION}/recetas`,
        recetaPorId: (id) => `${BASE_ADMINISTRACION}/recetas/${id}`,
        estadoReceta: (id) => `${BASE_ADMINISTRACION}/recetas/${id}/estado`
    }),

    publico: Object.freeze({
        recetas: `${BASE_PUBLICO}/recetas`,
        recetaPorId: (id) => `${BASE_PUBLICO}/recetas/${id}`,
        categorias: `${BASE_PUBLICO}/categorias`
    })
});
