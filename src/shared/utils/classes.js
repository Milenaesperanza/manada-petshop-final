/** Une clases CSS ignorando valores falsy: unirClases(estilos.a, activo && estilos.b) */
export const unirClases = (...clases) => clases.filter(Boolean).join(' ')
