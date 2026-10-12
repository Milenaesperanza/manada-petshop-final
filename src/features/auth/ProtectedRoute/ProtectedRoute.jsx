import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { EsqueletoPagina } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '../useAuth'

/** Protege rutas: sin sesión redirige a /ingresar y guarda la ruta para volver después. */
export function RutaProtegida() {
  const { estaAutenticado, inicializando } = useAutenticacion()
  const ubicacion = useLocation()

  if (inicializando) return <EsqueletoPagina />

  return estaAutenticado ? (
    <Outlet />
  ) : (
    <Navigate to={RUTAS.INGRESAR} state={{ desde: ubicacion.pathname }} replace />
  )
}
