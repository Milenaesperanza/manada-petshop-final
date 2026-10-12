import { Contenedor, Esqueleto } from '@/shared/ui'
import estilos from './PageSkeleton.module.css'

/** Alternativa genérica de Suspense mientras se descarga el código de una página. */
export function EsqueletoPagina() {
  return (
    <Contenedor clase={estilos.pagina} aria-busy="true" aria-label="Cargando">
      <Esqueleto ancho="min(380px, 70%)" alto="2.6rem" />
      <Esqueleto ancho="min(520px, 90%)" alto="1.1rem" />
      <Esqueleto alto="320px" radio="var(--radio-grande)" clase={estilos.bloqueCarga} />
    </Contenedor>
  )
}
