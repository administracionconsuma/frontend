// Valida sesión, estado y rol antes de montar cualquier página de Consuma.
import '../auth/seguridad.js';

// Incorpora únicamente el módulo correspondiente al Inicio administrativo.
if (document.querySelector('.inicio-administracion')) {
    import('./administracion/inicio/principal.js');
}

// Incorpora únicamente el módulo correspondiente al Inicio público.
if (document.querySelector('.inicio-publico')) {
    import('./publico/inicio/principal.js');
}

// Incorpora únicamente el módulo correspondiente a Recetas administrativas.
if (document.querySelector('.recetas-administracion')) {
    import('./administracion/recetas/principal.js');
}