import { use } from 'react'
import { ContextoCarrito } from './cartContext'

export function useCarrito() {
  const contexto = use(ContextoCarrito)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  return contexto
}
