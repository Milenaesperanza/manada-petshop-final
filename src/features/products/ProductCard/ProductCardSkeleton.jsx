import { Esqueleto } from '@/shared/ui'
import estilos from './ProductCard.module.css'

/** Misma estructura y alturas que <TarjetaProducto /> para evitar saltos de layout. */
export function EsqueletoTarjetaProducto() {
  return (
    <div className={estilos.tarjeta} aria-hidden="true">
      <Esqueleto alto="auto" radio="0" estilo={{ aspectRatio: '4 / 3' }} />
      <div className={estilos.cuerpo}>
        <Esqueleto alto="1.4rem" ancho="75%" />
        <div className={estilos.pie}>
          <Esqueleto alto="1.4rem" ancho="5rem" />
          <Esqueleto alto="2.1rem" ancho="6.5rem" radio="999px" />
        </div>
      </div>
    </div>
  )
}
