export const NOMBRE_TIENDA = 'Manada PetShop'

/** Colecciones de Firestore */
export const COLECCIONES = {
  PRODUCTOS: 'productos',
  CATEGORIAS: 'categorias',
  ANIMALES: 'animal',
  PEDIDOS: 'orders',
}

/** Categorías disponibles. `slug` es el valor guardado en Firestore y usado en la URL. */
export const ESTADOS_PEDIDO = {
  pendiente: { etiqueta: 'Pendiente', tono: 'kraft' },
  pagado: { etiqueta: 'Pagado', tono: 'oliva' },
  enviado: { etiqueta: 'Enviado', tono: 'cielo' },
  entregado: { etiqueta: 'Entregado', tono: 'oliva' },
  cancelado: { etiqueta: 'Cancelado', tono: 'peligro' },
}

/** Ajustá estos dos valores para cambiar la moneda de todo el sitio. */
export const MONEDA = { idioma: 'es-AR', codigo: 'ARS' }

export const RUTAS = {
  INICIO: '/',
  TIENDA: '/tienda',
  categoria: (slug) => `/tienda/${slug}`,
  producto: (id) => `/producto/${id}`,
  FINALIZAR_COMPRA: '/finalizar-compra',
  PEDIDOS: '/mis-pedidos',
  PERFIL: '/mi-perfil',
  INGRESAR: '/ingresar',
  REGISTRARSE: '/registro',
  NOSOTROS: '/nosotros',
  TERMINOS: '/terminos',
  PRIVACIDAD: '/privacidad',
  ARREPENTIMIENTO: '/arrepentimiento',
}
