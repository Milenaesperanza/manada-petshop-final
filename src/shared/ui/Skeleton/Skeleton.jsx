import { unirClases } from '@/shared/utils/classes'
import estilos from './Skeleton.module.css'

/** Bloque con brillo para reservar espacio mientras carga el contenido. */
export function Esqueleto({ ancho, alto = '1em', radio, clase, estilo }) {
  return (
    <span
      aria-hidden="true"
      className={unirClases(estilos.esqueleto, clase)}
      style={{ width: ancho, height: alto, borderRadius: radio, ...estilo }}
    />
  )
}
