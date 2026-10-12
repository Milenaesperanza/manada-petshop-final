import { unirClases } from '@/shared/utils/classes'
import estilos from './Container.module.css'

/** Ancho máximo + márgenes laterales. `angosto` para formularios y lecturas. */
export function Contenedor({ como: Componente = 'div', angosto = false, clase, children, ...props }) {
  return (
    <Componente className={unirClases(estilos.contenedor, angosto && estilos.angosto, clase)} {...props}>
      {children}
    </Componente>
  )
}
