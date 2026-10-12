import { Link } from 'react-router-dom'
import { PiTrash } from 'react-icons/pi'
import { ImagenPerezosa, SelectorCantidad } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useCarrito } from '../useCart'
import { formatearPrecio } from '@/shared/utils/format'
import estilos from './CartItem.module.css'

export function ArticuloCarrito({ articulo }) {
  const { establecerCantidad, quitarArticulo, cerrarCarrito } = useCarrito()

  return (
    <li className={estilos.elemento}>
      <Link to={RUTAS.producto(articulo.id)} onClick={cerrarCarrito} className={estilos.miniatura}>
        <ImagenPerezosa
          origen={articulo.imagen}
          textoAlternativo={articulo.nombre}
          tono={articulo.categoria === 'gato' ? 'arcilla' : 'cielo'}
        />
      </Link>

      <div className={estilos.detalles}>
        <Link to={RUTAS.producto(articulo.id)} onClick={cerrarCarrito} className={estilos.nombre}>
          {articulo.nombre}
        </Link>
        <span className={estilos.precio}>{formatearPrecio(articulo.precio * articulo.cantidad)}</span>

        <div className={estilos.controles}>
          <SelectorCantidad
            tamano="chico"
            valor={articulo.cantidad}
            minimo={0}
            maximo={articulo.stock}
            alCambiar={(cantidad) => establecerCantidad(articulo.id, cantidad)}
            etiqueta={`Cantidad de ${articulo.nombre}`}
          />
          <button
            type="button"
            className={estilos.quitar}
            onClick={() => quitarArticulo(articulo.id)}
            aria-label={`Quitar ${articulo.nombre} del carrito`}
          >
            <PiTrash aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  )
}
