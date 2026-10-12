import { use } from 'react'
import { ContextoAutenticacion } from './authContext'

export function useAutenticacion() {
  const contexto = use(ContextoAutenticacion)
  if (!contexto) throw new Error('useAutenticacion debe usarse dentro de <ProveedorAutenticacion>')
  return contexto
}
