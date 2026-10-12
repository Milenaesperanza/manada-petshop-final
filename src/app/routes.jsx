import { createElement, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RutaProtegida } from '@/features/auth'
import { DisposicionPrincipal } from '@/app/layout'

/**
 * Cada página es un fragmento aparte: el usuario sólo descarga lo que visita.
 * El <Suspense> que muestra el esqueleto de carga vive en <DisposicionPrincipal />.
 */
const pagina = (cargador, props) => createElement(lazy(cargador), props)

export const enrutador = createBrowserRouter([
  {
    element: <DisposicionPrincipal />,
    children: [
      { index: true, element: pagina(() => import('@/features/site/Home/Home')) },
      { path: 'tienda', element: pagina(() => import('@/features/products/Store/Store')) },
      { path: 'tienda/:categoria', element: pagina(() => import('@/features/products/Store/Store')) },
      { path: 'tienda/:categoria/:subcategoria', element: pagina(() => import('@/features/products/Store/Store')) },
      {
        path: 'producto/:id',
        element: pagina(() => import('@/features/products/ProductDetail/ProductDetail')),
      },
      { path: 'nosotros', element: pagina(() => import('@/features/site/About/About')) },
      ...['terminos', 'privacidad', 'arrepentimiento'].map((documento) => ({
        path: documento,
        element: pagina(() => import('@/features/site/Legal/Legal'), { documento }),
      })),
      {
        path: 'ingresar',
        element: pagina(() => import('@/features/auth/AuthPage/AuthPage'), {
          modo: 'ingresar',
        }),
      },
      {
        path: 'registro',
        element: pagina(() => import('@/features/auth/AuthPage/AuthPage'), {
          modo: 'registrar',
        }),
      },
      {
        // Rutas que requieren sesión
        element: <RutaProtegida />,
        children: [
          { path: 'mis-pedidos', element: pagina(() => import('@/features/orders/MyOrders/MyOrders')) },
          { path: 'mi-perfil', element: pagina(() => import('@/features/auth/Profile/Profile')) },
        ],
      },
      {
        path: 'finalizar-compra',
        element: pagina(() => import('@/features/orders/Checkout/Checkout')),
      },
      { path: '*', element: pagina(() => import('@/features/site/NotFound/NotFound')) },
    ],
  },
])
