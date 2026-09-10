// Define los accesos rápidos disponibles actualmente en el Inicio administrativo.
export const datosAccesosRapidos = [
    {
        id: 'nueva-receta',

        titulo: 'Nueva receta',

        descripcion: 'Creá una receta paso a paso.',

        icono: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H6.5A2.5 2.5 0 0 0 4 20.5Z"></path>
                <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14"></path>
                <path d="M14 6v15a3 3 0 0 1 3-3h.5a2.5 2.5 0 0 1 2.5 2.5v-15"></path>
            </svg>
        `
    },
    {
        id: 'nuevo-insumo',

        titulo: 'Nuevo insumo',

        descripcion: 'Agregá un insumo al sistema.',

        icono: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 3 7 4-7 4-7-4 7-4Z"></path>
                <path d="m5 7 7 4 7-4"></path>
                <path d="M5 7v10l7 4 7-4V7"></path>
                <path d="M12 11v10"></path>
            </svg>
        `
    },
    {
        id: 'nueva-categoria',

        titulo: 'Nueva categoría',

        descripcion: 'Creá una categoría para organizar tus recetas.',

        icono: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h6v6H4z"></path>
                <path d="M14 5h6v6h-6z"></path>
                <path d="M4 15h6v4H4z"></path>
                <path d="M14 15h6v4h-6z"></path>
            </svg>
        `
    }
];