import { Link } from 'react-router-dom'
import { PiPawPrintFill } from 'react-icons/pi'
import { Boton, Contenedor, EstadoVacio } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'

export default function NoEncontrada() {
  return (
    <Contenedor>
      <EstadoVacio
        icono={<PiPawPrintFill aria-hidden="true" />}
        titulo="Uy, esta página se escapó"
        descripcion="No encontramos lo que buscabas. Quizás el link cambió o ya no existe."
        accion={
          <Boton como={Link} to={RUTAS.INICIO}>
            Volver al inicio
          </Boton>
        }
      />
    </Contenedor>
  )
}
