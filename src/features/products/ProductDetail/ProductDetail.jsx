import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import aviso from 'react-hot-toast'
import { PiArrowLeft, PiShoppingBagFill, PiWarningCircle } from 'react-icons/pi'
import {
  Boton,
  Contenedor,
  EstadoVacio,
  Esqueleto,
  ImagenPerezosa,
  Insignia,
  SelectorCantidad,
} from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useCategorias } from '@/features/categories'
import { useCarrito } from '@/features/cart'
import { useProducto } from '../useProducts'
import { formatearPrecio } from '@/shared/utils/format'
import NoEncontrada from '@/features/site/NotFound/NotFound'
import estilos from './ProductDetail.module.css'

function EsqueletoDetalleProducto() {
  return (
    <div className={estilos.disposicion} aria-busy="true" aria-label="Cargando producto">
      <Esqueleto alto="auto" radio="var(--radio-extra)" estilo={{ aspectRatio: '1 / 1' }} />
      <div className={estilos.informacion}>
        <Esqueleto ancho="6rem" alto="1.6rem" radio="999px" />
        <Esqueleto ancho="80%" alto="2.6rem" />
        <Esqueleto ancho="9rem" alto="2rem" />
        <Esqueleto alto="1rem" />
        <Esqueleto alto="1rem" ancho="90%" />
        <Esqueleto alto="1rem" ancho="70%" />
        <Esqueleto alto="3.2rem" ancho="16rem" radio="999px" estilo={{ marginTop: '1rem' }} />
      </div>
    </div>
  )
}

export default function DetalleProducto() {
  const { id } = useParams()
  const ubicacion = useLocation()
  const { datos: producto, cargando, error, recargar } = useProducto(id)
  const { datos: categorias } = useCategorias()
  const { agregarArticulo, abrirCarrito } = useCarrito()
  const [cantidad, setCantidad] = useState(1)

  const manejarAgregar = () => {
    agregarArticulo(producto, cantidad)
    aviso.success(`${producto.nombre} se agregó al carrito`)
    abrirCarrito()
  }

  if (!cargando && !error && !producto) return <NoEncontrada />

  const categoria = categorias?.find((c) => c.slug === producto?.animal)
  const rutaDeRetorno = ubicacion.state?.rutaDeRetorno
    ?? (categoria ? RUTAS.categoria(categoria.slug) : RUTAS.TIENDA)
  const tono = producto?.animal === 'perro' ? 'cielo' : 'arcilla'
  const sinStock = producto?.stock === 0

  return (
    <Contenedor>
      <Link to={rutaDeRetorno} className={estilos.volver}>
        <PiArrowLeft aria-hidden="true" /> Volver a la tienda
      </Link>

      {cargando ? (
        <EsqueletoDetalleProducto />
      ) : error ? (
        <EstadoVacio
          icono={<PiWarningCircle aria-hidden="true" />}
          titulo="No pudimos cargar el producto"
          accion={<Boton onClick={recargar}>Reintentar</Boton>}
        />
      ) : (
        <div className={estilos.disposicion}>
          <ImagenPerezosa
            origen={producto.imagen}
            textoAlternativo={producto.nombre}
            tono={tono}
            prioritaria
            clase={estilos.imagen}
          />

          <div className={estilos.informacion}>
            <Insignia tono={tono}>{categoria?.etiqueta}</Insignia>
            <h1 className={estilos.nombre}>{producto.nombre}</h1>
            <p className={estilos.precio}>{formatearPrecio(producto.precio)}</p>
            <p className={estilos.descripcion}>{producto.descripcion}</p>

            <p className={estilos.stock}>
              {sinStock ? 'Sin stock por el momento' : `${producto.stock} unidades disponibles`}
            </p>

            <div className={estilos.compra}>
              <SelectorCantidad valor={cantidad} alCambiar={setCantidad} maximo={producto.stock} />
              <Boton
                tamano="grande"
                icono={<PiShoppingBagFill aria-hidden="true" />}
                onClick={manejarAgregar}
                deshabilitado={sinStock}
              >
                Agregar al carrito
              </Boton>
            </div>
          </div>
        </div>
      )}
    </Contenedor>
  )
}
