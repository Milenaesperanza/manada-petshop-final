import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PanelCarrito } from '@/features/cart'
import { RUTAS } from '@/shared/config/constants'
import { CintaTexto } from '../TextRibbon/TextRibbon'
import { Encabezado } from '../Header/Header'
import { EsqueletoPagina } from '@/shared/ui'
import { PieDePagina } from '../Footer/Footer'
import estilos from './MainLayout.module.css'

function VolverArriba() {
  const { pathname: rutaActual } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [rutaActual])
  return null
}

/** Estructura común de todas las páginas: encabezado, cinta, contenido, pie y carrito. */
export function DisposicionPrincipal() {
  const { pathname } = useLocation()
  const esVistaTienda = pathname.startsWith('/tienda')
  const esVistaCheckout = pathname === '/finalizar-compra'
  const esVistaPerfil = pathname === '/mi-perfil'
  const esVistaPedidos = pathname === '/mis-pedidos'
  const esVistaNosotros = pathname === '/nosotros'
  const esVistaIngresar = pathname === RUTAS.INGRESAR
  const esVistaDetalleProducto = pathname.startsWith('/producto/')
  const esVistaLegal = ['/terminos', '/privacidad', '/arrepentimiento'].includes(pathname)

  return (
    <>
      <VolverArriba />
      <Encabezado />
      {!esVistaTienda &&
        !esVistaCheckout &&
        !esVistaPerfil &&
        !esVistaPedidos &&
        !esVistaNosotros &&
        !esVistaIngresar &&
        !esVistaDetalleProducto &&
        !esVistaLegal && <CintaTexto />}
      <main className={estilos.principal}>
        {/* Las páginas se cargan con lazy(): mientras baja el fragmento se ve un esqueleto */}
        <Suspense fallback={<EsqueletoPagina />}>
          <Outlet />
        </Suspense>
      </main>
      <PieDePagina />
      <PanelCarrito />
    </>
  )
}
