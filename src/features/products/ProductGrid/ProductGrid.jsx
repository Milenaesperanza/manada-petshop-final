import { EsqueletoTarjetaProducto } from '../ProductCard/ProductCardSkeleton'
import { TarjetaProducto } from '../ProductCard/ProductCard'
import estilos from './ProductGrid.module.css'

/** Grilla de productos que muestra esqueletos mientras `cargando` es true. */
export function GrillaProductos({ productos, cargando = false, cantidadEsqueletos = 8 }) {
  return (
    <div className={estilos.grilla} aria-busy={cargando} aria-live="polite">
      {cargando
        ? Array.from({ length: cantidadEsqueletos }, (_, indice) => (
            <EsqueletoTarjetaProducto key={indice} />
          ))
        : productos.map((producto) => <TarjetaProducto key={producto.id} producto={producto} />)}
    </div>
  )
}
