import { Link } from 'react-router-dom'
import { PiPawPrintFill } from 'react-icons/pi'
import { NOMBRE_TIENDA, RUTAS } from '@/shared/config/constants'
import { unirClases } from '@/shared/utils/classes'
import estilos from './Logo.module.css'

export function Logotipo({ claro = false, clase }) {
  return (
    <Link
      to={RUTAS.INICIO}
      className={unirClases(estilos.logotipo, claro && estilos.claro, clase)}
      aria-label={`${NOMBRE_TIENDA} — inicio`}
    >
      <span className={estilos.isotipo}>
        <PiPawPrintFill aria-hidden="true" />
      </span>
      <span className={estilos.nombre}>
        Manada<span className={estilos.acento}>PetShop</span>
      </span>
    </Link>
  )
}
