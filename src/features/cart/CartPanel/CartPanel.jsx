import { Link } from 'react-router-dom'
import * as Dialogo from '@radix-ui/react-dialog'
import { PiShoppingBag, PiX } from 'react-icons/pi'
import { Boton, EstadoVacio } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useCarrito } from '../useCart'
import { formatearPrecio } from '@/shared/utils/format'
import { ArticuloCarrito } from '../CartItem/CartItem'
import estilos from './CartPanel.module.css'

/** Carrito lateral. Radix Dialog se encarga del foco, Esc y el bloqueo de scroll. */
export function PanelCarrito() {
  const { articulos, subtotal, estaAbierto, abrirCarrito, cerrarCarrito, vaciarCarrito } = useCarrito()

  return (
    <Dialogo.Root
      open={estaAbierto}
      onOpenChange={(abierto) => (abierto ? abrirCarrito() : cerrarCarrito())}
    >
      <Dialogo.Portal>
        <Dialogo.Overlay className={estilos.superposicion} />
        <Dialogo.Content className={estilos.panel} aria-describedby={undefined}>
          <header className={estilos.encabezado}>
            <Dialogo.Title className={estilos.titulo}>Tu carrito</Dialogo.Title>
            <div className={estilos.accionesEncabezado}>
              {articulos.length > 0 && (
                <Boton variante="fantasma" tamano="chico" onClick={vaciarCarrito}>
                  Vaciar carrito
                </Boton>
              )}
              <Dialogo.Close className={estilos.cerrar} aria-label="Cerrar carrito">
                <PiX aria-hidden="true" />
              </Dialogo.Close>
            </div>
          </header>

          {articulos.length === 0 ? (
            <EstadoVacio
              icono={<PiShoppingBag aria-hidden="true" />}
              titulo="Tu carrito está vacío"
              descripcion="Sumá algo rico o divertido para tu mascota."
              accion={
                <Boton como={Link} to={RUTAS.TIENDA} onClick={cerrarCarrito}>
                  Ver la tienda
                </Boton>
              }
            />
          ) : (
            <>
              <ul className={estilos.lista} role="list">
                {articulos.map((articulo) => (
                  <ArticuloCarrito key={articulo.id} articulo={articulo} />
                ))}
              </ul>

              <footer className={estilos.pie}>
                <div className={estilos.subtotal}>
                  <span>Subtotal</span>
                  <strong>{formatearPrecio(subtotal)}</strong>
                </div>
                <Boton
                  como={Link}
                  to={RUTAS.FINALIZAR_COMPRA}
                  onClick={cerrarCarrito}
                  tamano="grande"
                  anchoCompleto
                >
                  Finalizar compra
                </Boton>
              </footer>
            </>
          )}
        </Dialogo.Content>
      </Dialogo.Portal>
    </Dialogo.Root>
  )
}
