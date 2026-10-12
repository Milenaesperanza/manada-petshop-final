import { unirClases } from '@/shared/utils/classes'
import estilos from './Badge.module.css'

/** tono: arcilla | cielo | oliva | kraft | peligro | neutro */
export function Insignia({ tono = 'neutro', clase, children }) {
  return <span className={unirClases(estilos.insignia, estilos[tono], clase)}>{children}</span>
}
