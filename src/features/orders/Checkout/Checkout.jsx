import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import aviso from 'react-hot-toast'
import { PiShoppingBag } from 'react-icons/pi'
import {
  Boton,
  Campo,
  Contenedor,
  EncabezadoPagina,
  EstadoVacio,
  ImagenPerezosa,
  SelectorCantidad,
} from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '@/features/auth'
import { FormularioAutenticacion } from '@/features/auth/AuthForm/AuthForm'
import { obtenerPerfil } from '@/features/auth/profileService'
import { useCarrito } from '@/features/cart'
import { crearPedido } from '../ordersService'
import { formatearPrecio } from '@/shared/utils/format'
import estilos from './Checkout.module.css'

const COSTO_ENVIO = 0

const validarNumeroTarjeta = (numero) => {
  const digitos = numero.replace(/\D/g, '')
  return /^\d{16}$/.test(digitos)
}

const validarVencimiento = (vencimiento) => {
  const coincidencia = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(vencimiento)
  if (!coincidencia) return false
  const mes = Number(coincidencia[1])
  const anio = 2000 + Number(coincidencia[2])
  const hoy = new Date()
  return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1)
}

export default function FinalizarCompra() {
  const { usuario, inicializando } = useAutenticacion()
  const { articulos, subtotal, establecerCantidad, vaciarCarrito } = useCarrito()

  const [valores, setValores] = useState(() => {
    return {
      nombreCompleto: usuario?.nombre ?? '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      titularTarjeta: usuario?.nombre ?? '',
      numeroTarjeta: '',
      vencimiento: '',
      codigoSeguridad: '',
    }
  })
  useEffect(() => {
    if (!usuario?.uid) return
    obtenerPerfil(usuario.uid).then((perfil) => {
      if (!perfil) return
      setValores((anteriores) => ({
        ...anteriores,
        ...perfil,
        titularTarjeta: perfil.nombreCompleto ?? anteriores.titularTarjeta,
      }))
    })
  }, [usuario?.uid])
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)

  if (inicializando) {
    return (
      <Contenedor>
        <div aria-busy="true" aria-live="polite">Validando sesión…</div>
      </Contenedor>
    )
  }

  if (!usuario) {
    return (
      <Contenedor angosto>
        <FormularioAutenticacion modo="ingresar" />
      </Contenedor>
    )
  }

  if (!usuario && import.meta.env.VITE_MOSTRAR_ESTADO_LOGIN === 'true') {
    return (
      <Contenedor>
        <EstadoVacio
          titulo="Iniciá sesión para continuar"
          descripcion="Tus productos se conservarán en el carrito mientras te autenticás."
          accion={
            <Boton
              como={Link}
              to={RUTAS.INGRESAR}
              state={{ desde: RUTAS.FINALIZAR_COMPRA }}
            >
              Ingresar
            </Boton>
          }
        />
      </Contenedor>
    )
  }

  if (pedidoConfirmado) {
    const { id, articulos: articulosConfirmados, cliente, total } = pedidoConfirmado

    return (
      <Contenedor>
        <section className={estilos.confirmacion} aria-labelledby="titulo-confirmacion">
          <div className={estilos.confirmacionEncabezado}>
            <span className={estilos.confirmacionIcono} aria-hidden="true">✓</span>
            <p className={estilos.confirmacionEyebrow}>¡Gracias por tu compra!</p>
            <h1 id="titulo-confirmacion">Tu pedido está confirmado</h1>
            <p className={estilos.confirmacionDescripcion}>
              Recibimos tu pedido y ya estamos preparando todo para despacharlo.
            </p>
            <div className={estilos.codigoOrden}>
              <span>Número de orden</span>
              <strong>{id}</strong>
            </div>
          </div>

          <div className={estilos.confirmacionColumnas}>
            <section className={estilos.confirmacionTarjeta} aria-labelledby="resumen-compra">
              <h2 id="resumen-compra">Resumen de la compra</h2>
              <ul className={estilos.confirmacionArticulos}>
                {articulosConfirmados.map((articulo) => (
                  <li key={articulo.id}>
                    <div>
                      <strong>{articulo.nombre}</strong>
                      <span>{articulo.cantidad} unidad{articulo.cantidad === 1 ? '' : 'es'}</span>
                    </div>
                    <strong>{formatearPrecio(articulo.precio * articulo.cantidad)}</strong>
                  </li>
                ))}
              </ul>
              <div className={estilos.confirmacionTotal}>
                <span>Total abonado</span>
                <strong>{formatearPrecio(total)}</strong>
              </div>
            </section>

            <section className={estilos.confirmacionTarjeta} aria-labelledby="despacho-compra">
              <h2 id="despacho-compra">Información de despacho</h2>
              <dl className={estilos.confirmacionDatos}>
                <div><dt>Destinatario</dt><dd>{cliente.nombreCompleto}</dd></div>
                <div><dt>Dirección</dt><dd>{cliente.direccion}, {cliente.ciudad} ({cliente.codigoPostal})</dd></div>
                <div><dt>Teléfono</dt><dd>{cliente.telefono}</dd></div>
                <div><dt>Medio de pago</dt><dd>Tarjeta terminada en {cliente.pago?.ultimosCuatro ?? '—'}</dd></div>
                <div><dt>Envío</dt><dd>Gratis · a domicilio</dd></div>
                <div><dt>Estado</dt><dd>Pedido recibido · preparando despacho</dd></div>
              </dl>
            </section>

            <section className={estilos.confirmacionTarjeta} aria-labelledby="proximos-pasos">
              <h2 id="proximos-pasos">¿Qué sigue?</h2>
              <ol className={estilos.confirmacionPasos}>
                <li><strong>Preparación</strong><span>Armamos tu pedido con cuidado.</span></li>
                <li><strong>Despacho</strong><span>Te avisaremos cuando salga hacia tu domicilio.</span></li>
                <li><strong>Seguimiento</strong><span>Podés consultar el estado desde Mis pedidos.</span></li>
              </ol>
            </section>
          </div>

          <div className={estilos.confirmacionAcciones}>
            <Boton como={Link} to={RUTAS.PEDIDOS}>
              Ver mis pedidos
            </Boton>
            <Boton como={Link} to={RUTAS.TIENDA} variante="secundario">
              Seguir comprando
            </Boton>
          </div>
        </section>
      </Contenedor>
    )
  }

  if (articulos.length === 0 && !enviando) {
    return (
      <Contenedor>
        <EstadoVacio
          icono={<PiShoppingBag aria-hidden="true" />}
          titulo="No hay nada para pagar"
          descripcion="Agregá productos a tu carrito para continuar."
          accion={
            <Boton como={Link} to={RUTAS.TIENDA}>
              Ir a la tienda
            </Boton>
          }
        />
      </Contenedor>
    )
  }

  const manejarCambio = (evento) => {
    const { name: campo, value: valor } = evento.target
    let valorFormateado = valor
    if (campo === 'numeroTarjeta') {
      valorFormateado = valor.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (campo === 'vencimiento') {
      const digitos = valor.replace(/\D/g, '').slice(0, 4)
      valorFormateado = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
    }
    if (campo === 'codigoSeguridad') valorFormateado = valor.replace(/\D/g, '').slice(0, 4)
    setValores((anteriores) => ({ ...anteriores, [campo]: valorFormateado }))
    setErrores((anteriores) => ({ ...anteriores, [campo]: undefined }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    const erroresNuevos = {}
    if (valores.nombreCompleto.trim().length < 3) erroresNuevos.nombreCompleto = 'Ingresá tu nombre y apellido.'
    if (!/^[+\d\s().-]{8,}$/.test(valores.telefono.trim())) erroresNuevos.telefono = 'Ingresá un teléfono válido.'
    if (valores.direccion.trim().length < 5) erroresNuevos.direccion = 'Ingresá una dirección válida.'
    if (valores.ciudad.trim().length < 2) erroresNuevos.ciudad = 'Ingresá tu ciudad.'
    if (!/^[A-Za-z0-9 -]{4,8}$/.test(valores.codigoPostal.trim())) {
      erroresNuevos.codigoPostal = 'Ingresá un código postal válido.'
    }
    if (valores.titularTarjeta.trim().length < 3) erroresNuevos.titularTarjeta = 'Ingresá el nombre del titular.'
    if (!validarNumeroTarjeta(valores.numeroTarjeta)) erroresNuevos.numeroTarjeta = 'Ingresá un número de tarjeta válido.'
    if (!validarVencimiento(valores.vencimiento)) erroresNuevos.vencimiento = 'Usá el formato MM/AA y una fecha válida.'
    if (!/^\d{3,4}$/.test(valores.codigoSeguridad)) erroresNuevos.codigoSeguridad = 'Ingresá un código de seguridad válido.'
    setErrores(erroresNuevos)
    if (Object.keys(erroresNuevos).length > 0) return

    setEnviando(true)
    try {
      const cliente = {
        ...valores,
        pago: {
          metodo: 'tarjeta',
          titular: valores.titularTarjeta,
          ultimosCuatro: valores.numeroTarjeta.replace(/\D/g, '').slice(-4),
          vencimiento: valores.vencimiento,
        },
      }
      delete cliente.numeroTarjeta
      delete cliente.codigoSeguridad
      const idPedido = await crearPedido({ usuario, articulos, cliente, total: subtotal + COSTO_ENVIO })
      vaciarCarrito()
      setPedidoConfirmado({ id: idPedido, articulos, cliente, total: subtotal + COSTO_ENVIO })
    } catch (error) {
      if (error?.code === 'stock-insuficiente') {
        aviso.error('La cantidad solicitada supera el stock disponible. Revisá tu carrito.')
        setEnviando(false)
        return
      }
      if (error?.code === 'permission-denied') {
        aviso.error('Firebase rechazó la operación. Publicá las nuevas reglas de Firestore.')
        setEnviando(false)
        return
      }
      aviso.error('No pudimos registrar tu pedido. Intentá de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <Contenedor>
      <EncabezadoPagina
        titulo="Finalizar compra"
        descripcion="Completá el pago y tus datos de entrega para confirmar el pedido."
      />

      <div className={estilos.disposicion}>
        <form id="formulario-checkout" className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
          <h2 className={estilos.titular}>Datos de pago</h2>
          <p className={estilos.ayudaPago}>Pago seguro con tarjeta de crédito o débito.</p>
          <Campo
            etiqueta="Nombre del titular"
            name="titularTarjeta"
            autoComplete="cc-name"
            placeholder="Ej: María González"
            value={valores.titularTarjeta}
            onChange={manejarCambio}
            error={errores.titularTarjeta}
          />
          <div className={estilos.camposTarjeta}>
            <Campo
              etiqueta="Número de tarjeta"
              name="numeroTarjeta"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={valores.numeroTarjeta}
              onChange={manejarCambio}
              error={errores.numeroTarjeta}
            />
            <Campo
              etiqueta="Vencimiento"
              name="vencimiento"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={valores.vencimiento}
              onChange={manejarCambio}
              error={errores.vencimiento}
            />
            <Campo
              etiqueta="Código de seguridad"
              name="codigoSeguridad"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVV"
              value={valores.codigoSeguridad}
              onChange={manejarCambio}
              error={errores.codigoSeguridad}
            />
          </div>

          <h2 className={estilos.titular}>Datos de entrega</h2>
          <Campo
            etiqueta="Nombre y apellido"
            name="nombreCompleto"
            autoComplete="name"
              placeholder="Ej: María González"
            value={valores.nombreCompleto}
            onChange={manejarCambio}
            error={errores.nombreCompleto}
          />
          <div className={estilos.camposEntrega}>
            <Campo
              etiqueta="Teléfono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              placeholder="Ej: 11 1234-5678"
              value={valores.telefono}
              onChange={manejarCambio}
              error={errores.telefono}
            />
          </div>
          <div className={estilos.camposEntrega}>
            <Campo
              etiqueta="Dirección"
              name="direccion"
              autoComplete="street-address"
              placeholder="Ej: Av. Corrientes 1234"
              value={valores.direccion}
              onChange={manejarCambio}
              error={errores.direccion}
            />
            <Campo
              etiqueta="Ciudad"
              name="ciudad"
              autoComplete="address-level2"
              placeholder="Ej: Buenos Aires"
              value={valores.ciudad}
              onChange={manejarCambio}
              error={errores.ciudad}
            />
            <Campo
              etiqueta="Código postal"
              name="codigoPostal"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Ej: 1414"
              value={valores.codigoPostal}
              onChange={manejarCambio}
              error={errores.codigoPostal}
            />
          </div>
        </form>

        <aside className={estilos.resumen} aria-label="Resumen del pedido">
          <h2 className={estilos.titular}>Tu pedido</h2>
          <ul className={estilos.elementos} role="list">
            {articulos.map((articulo) => (
              <li key={articulo.id} className={estilos.elemento}>
                <ImagenPerezosa
                  origen={articulo.imagen}
                  textoAlternativo={articulo.nombre}
                  tono={articulo.categoria === 'perro' ? 'cielo' : 'arcilla'}
                  clase={estilos.miniatura}
                />
                <div className={estilos.infoElemento}>
                  <span className={estilos.nombreElemento}>{articulo.nombre}</span>
                  <div className={estilos.cantidadCheckout}>
                    <SelectorCantidad
                      tamano="chico"
                      valor={articulo.cantidad}
                      minimo={0}
                      maximo={articulo.stock}
                      alCambiar={(cantidad) => establecerCantidad(articulo.id, cantidad)}
                      etiqueta={`Cantidad de ${articulo.nombre}`}
                    />
                  </div>
                </div>
                <strong>{formatearPrecio(articulo.precio * articulo.cantidad)}</strong>
              </li>
            ))}
          </ul>
          <div className={estilos.lineaResumen}>
            <span>Envío gratis a todo el país</span>
            <strong>{formatearPrecio(COSTO_ENVIO)}</strong>
          </div>
          <div className={estilos.total}>
            <span>Total</span>
            <strong>{formatearPrecio(subtotal + COSTO_ENVIO)}</strong>
          </div>
          <Boton
            clase={estilos.accionDesktop}
            type="submit"
            form="formulario-checkout"
            tamano="grande"
            anchoCompleto
            cargando={enviando}
          >
            Confirmar pedido · {formatearPrecio(subtotal + COSTO_ENVIO)}
          </Boton>
          <Boton
            clase={estilos.vaciarCarrito}
            variante="fantasma"
            tamano="chico"
            onClick={vaciarCarrito}
          >
            Vaciar carrito
          </Boton>
        </aside>

        <div className={estilos.accionMovil}>
          <Boton
            type="submit"
            form="formulario-checkout"
            tamano="grande"
            anchoCompleto
            cargando={enviando}
          >
            Confirmar pedido · {formatearPrecio(subtotal + COSTO_ENVIO)}
          </Boton>
        </div>
      </div>
    </Contenedor>
  )
}
