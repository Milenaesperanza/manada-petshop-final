import { Navigate, useLocation } from 'react-router-dom'
import { FormularioAutenticacion } from '../AuthForm/AuthForm'
import { Contenedor } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '../useAuth'

/** Página compartida por /ingresar y /registro: sólo cambia `modo`. */
export default function PaginaAutenticacion({ modo }) {
  const { estaAutenticado } = useAutenticacion()
  const ubicacion = useLocation()

  if (estaAutenticado) return <Navigate to={ubicacion.state?.desde ?? RUTAS.FINALIZAR_COMPRA} replace />

  return (
    <Contenedor angosto>
      <FormularioAutenticacion modo={modo} />
    </Contenedor>
  )
}
