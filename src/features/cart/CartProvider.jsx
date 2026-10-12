import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { ContextoCarrito } from './cartContext'

const CLAVE_ALMACENAMIENTO = 'manada:carrito'

const cargarCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO)) ?? []
  } catch {
    return []
  }
}

const limitarCantidad = (cantidad, stock) =>
  stock != null && stock <= 0 ? 0 : Math.max(1, Math.min(cantidad, stock ?? Infinity))

function reductorCarrito(articulos, accion) {
  switch (accion.tipo) {
    case 'AGREGAR': {
      const { producto, cantidad } = accion
      if (Number(producto.stock ?? 0) <= 0) {
        return articulos.filter((articulo) => articulo.id !== producto.id)
      }
      const existente = articulos.find((articulo) => articulo.id === producto.id)
      if (existente) {
        return articulos.map((articulo) =>
          articulo.id === producto.id
            ? {
                ...articulo,
                stock: producto.stock ?? articulo.stock,
                cantidad: limitarCantidad(articulo.cantidad + cantidad, producto.stock ?? articulo.stock),
              }
            : articulo,
        )
      }
      return [
        ...articulos,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          categoria: producto.animal ?? producto.categoria,
          stock: producto.stock,
          cantidad: limitarCantidad(cantidad, producto.stock),
        },
      ]
    }
    case 'ESTABLECER_CANTIDAD':
      if (accion.cantidad <= 0) return articulos.filter((articulo) => articulo.id !== accion.id)
      return articulos.map((articulo) =>
        articulo.id === accion.id
          ? articulo.stock <= 0
            ? null
            : { ...articulo, cantidad: limitarCantidad(accion.cantidad, articulo.stock) }
          : articulo,
      ).filter(Boolean)
    case 'QUITAR':
      return articulos.filter((articulo) => articulo.id !== accion.id)
    case 'VACIAR':
      return []
    default:
      return articulos
  }
}

export function ProveedorCarrito({ children }) {
  const [articulos, despachar] = useReducer(reductorCarrito, undefined, cargarCarrito)
  const [estaAbierto, setEstaAbierto] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(articulos))
    } catch {
      // Almacenamiento lleno o bloqueado: el carrito sigue funcionando en memoria.
    }
  }, [articulos])

  const agregarArticulo = useCallback(
    (producto, cantidad = 1) => despachar({ tipo: 'AGREGAR', producto, cantidad }),
    [],
  )
  const establecerCantidad = useCallback(
    (id, cantidad) => despachar({ tipo: 'ESTABLECER_CANTIDAD', id, cantidad }),
    [],
  )
  const quitarArticulo = useCallback((id) => despachar({ tipo: 'QUITAR', id }), [])
  const vaciarCarrito = useCallback(() => despachar({ tipo: 'VACIAR' }), [])
  const abrirCarrito = useCallback(() => setEstaAbierto(true), [])
  const cerrarCarrito = useCallback(() => setEstaAbierto(false), [])

  const valor = useMemo(
    () => ({
      articulos,
      cantidadTotal: articulos.reduce((suma, articulo) => suma + articulo.cantidad, 0),
      subtotal: articulos.reduce((suma, articulo) => suma + articulo.precio * articulo.cantidad, 0),
      estaAbierto,
      agregarArticulo,
      establecerCantidad,
      quitarArticulo,
      vaciarCarrito,
      abrirCarrito,
      cerrarCarrito,
    }),
    [
      articulos,
      estaAbierto,
      agregarArticulo,
      establecerCantidad,
      quitarArticulo,
      vaciarCarrito,
      abrirCarrito,
      cerrarCarrito,
    ],
  )

  return <ContextoCarrito value={valor}>{children}</ContextoCarrito>
}
