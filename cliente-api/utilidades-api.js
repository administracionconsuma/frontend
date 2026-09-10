// Utilidades comunes para construir parámetros y validar identificadores.

export function validarId(id, nombre = 'id') {
    const numero = Number(id);

    if (!Number.isInteger(numero) || numero <= 0) {
        throw new TypeError(`${nombre} debe ser un entero positivo.`);
    }

    return numero;
}

export function validarPaginacion(page = 0, size = 20) {
    const paginaNormalizada = Number(page);
    const tamanoNormalizado = Number(size);

    if (!Number.isInteger(paginaNormalizada) || paginaNormalizada < 0) {
        throw new TypeError('page debe ser un entero mayor o igual a cero.');
    }

    if (!Number.isInteger(tamanoNormalizado) || tamanoNormalizado < 1 || tamanoNormalizado > 100) {
        throw new TypeError('size debe ser un entero entre 1 y 100.');
    }

    return {
        page: paginaNormalizada,
        size: tamanoNormalizado
    };
}

export function construirQuery(parametros = {}) {
    const query = new URLSearchParams();

    Object.entries(parametros).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === '') {
            return;
        }

        query.set(clave, String(valor));
    });

    const resultado = query.toString();
    return resultado ? `?${resultado}` : '';
}

export function validarObjeto(valor, nombre = 'datos') {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
        throw new TypeError(`${nombre} debe ser un objeto.`);
    }

    return valor;
}
