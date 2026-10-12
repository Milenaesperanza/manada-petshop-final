import { Link } from 'react-router-dom'
import { PiPackage, PiWarningCircle } from 'react-icons/pi'
import { Boton, Contenedor, EncabezadoPagina, Esqueleto, EstadoVacio, Insignia } from '@/shared/ui'
import { ESTADOS_PEDIDO, RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '@/features/auth'
import { usePedidos } from '../useOrders'
import { formatearFecha, formatearPrecio } from '@/shared/utils/format'
import estilos from './MyOrders.module.css'

function EsqueletoPedido() {
  return (
    <div className={estilos.pedido} aria-hidden="true">
      <Esqueleto ancho="40%" alto="1.3rem" />
      <Esqueleto ancho="25%" alto="1rem" />
      <Esqueleto ancho="60%" alto="1rem" />
    </div>
  )
}

export default function MisPedidos() {
  const { usuario } = useAutenticacion()
  const { datos: pedidos, cargando, error, recargar } = usePedidos(usuario.uid)

  return (
    <Contenedor>
      <EncabezadoPagina
        titulo="Mis pedidos"
        descripcion="El historial de tus compras en Manada PetShop."
      >
        <Boton clase={estilos.volver} como={Link} to={RUTAS.TIENDA} variante="secundario" tamano="chico">
          Volver a la tienda
        </Boton>
      </EncabezadoPagina>

      {cargando ? (
        <div className={estilos.lista} aria-busy="true">
          {Array.from({ length: 3 }, (_, indice) => (
            <EsqueletoPedido key={indice} />
          ))}
        </div>
      ) : error ? (
        <EstadoVacio
          icono={<PiWarningCircle aria-hidden="true" />}
          titulo="No pudimos cargar tus pedidos"
          accion={<Boton onClick={recargar}>Reintentar</Boton>}
        />
      ) : pedidos.length === 0 ? (
        <EstadoVacio
          icono={<PiPackage aria-hidden="true" />}
          titulo="Todavía no hiciste pedidos"
          descripcion="Cuando compres algo, lo vas a ver acá."
          accion={
            <Boton como={Link} to={RUTAS.TIENDA}>
              Ir a la tienda
            </Boton>
          }
        />
      ) : (
        <>
          <ul className={estilos.lista} role="list">
          {pedidos.map((pedido) => {
            const estado = ESTADOS_PEDIDO[pedido.estado] ?? ESTADOS_PEDIDO.pendiente
            return (
              <li key={pedido.id} className={estilos.pedido}>
                <div className={estilos.cabecera}>
                  <div>
                    <h2 className={estilos.codigo}>Pedido #{pedido.id.slice(-6).toUpperCase()}</h2>
                    <time className={estilos.fecha} dateTime={pedido.creadoEn ?? undefined}>
                      {formatearFecha(pedido.creadoEn)}
                    </time>
                  </div>
                  <Insignia tono={estado.tono}>{estado.etiqueta}</Insignia>
                </div>

                <ul className={estilos.elementos} role="list">
                  {pedido.articulos.map((articulo) => (
                    <li key={articulo.id}>
                      {articulo.cantidad} × {articulo.nombre}
                    </li>
                  ))}
                </ul>

                <p className={estilos.total}>
                  Total <strong>{formatearPrecio(pedido.total)}</strong>
                </p>
              </li>
            )
          })}
          </ul>
        </>
      )}
    </Contenedor>
  )
}
