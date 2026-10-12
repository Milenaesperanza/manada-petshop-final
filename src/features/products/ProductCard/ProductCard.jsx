import { Link } from 'react-router-dom'
import aviso from 'react-hot-toast'
import { PiCatFill, PiDogFill, PiPlusBold } from 'react-icons/pi'
import { Boton, ImagenPerezosa, Insignia } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useCarrito } from '@/features/cart'
import { formatearPrecio } from '@/shared/utils/format'
import estilos from './ProductCard.module.css'

const META_CATEGORIA = {
  gato: { tono: 'arcilla', Icono: PiCatFill },
  perro: { tono: 'cielo', Icono: PiDogFill },
}

export function TarjetaProducto({ producto }) {
  const { agregarArticulo, articulos } = useCarrito()
  const { tono, Icono } = META_CATEGORIA[producto.animal] ?? META_CATEGORIA.gato
  const etiquetaCategoria = producto.etiquetaCategoria ?? producto.categoria
  const stockDisponible = Number(producto.stock ?? 0)
  const articuloEnCarrito = articulos.find((articulo) => articulo.id === producto.id)
  const sinStock = stockDisponible <= 0
  const cantidadMaximaEnCarrito = (articuloEnCarrito?.cantidad ?? 0) >= stockDisponible

  const manejarAgregar = () => {
    if (sinStock || cantidadMaximaEnCarrito) {
      aviso.error('Ya tenés la cantidad máxima disponible de este producto.')
      return
    }
    agregarArticulo(producto)
    aviso.success(`${producto.nombre} se agregó al carrito`)
  }

  return (
    <article className={estilos.tarjeta}>
      <Link to={RUTAS.producto(producto.id)} className={estilos.multimedia}>
        <ImagenPerezosa
          origen={producto.imagen}
          textoAlternativo={producto.nombre}
          proporcion="4 / 3"
          tono={tono}
        />
        <Insignia tono={tono} clase={estilos.insignia}>
          <Icono aria-hidden="true" /> {etiquetaCategoria}
        </Insignia>
      </Link>

      <div className={estilos.cuerpo}>
        <h3 className={estilos.nombre}>
          <Link to={RUTAS.producto(producto.id)}>{producto.nombre}</Link>
        </h3>

        <div className={estilos.pie}>
          <span className={estilos.precio}>{formatearPrecio(producto.precio)}</span>
          <Boton
            tamano="chico"
            icono={<PiPlusBold aria-hidden="true" />}
            onClick={manejarAgregar}
            deshabilitado={sinStock || cantidadMaximaEnCarrito}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            {sinStock ? 'Sin stock' : cantidadMaximaEnCarrito ? 'Stock máximo' : 'Agregar'}
          </Boton>
        </div>
      </div>
    </article>
  )
}
