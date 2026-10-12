import { NavLink } from 'react-router-dom'
import { PiShoppingBagFill } from 'react-icons/pi'
import { RUTAS } from '@/shared/config/constants'
import { useCategorias } from '@/features/categories'
import { useCarrito } from '@/features/cart'
import { unirClases } from '@/shared/utils/classes'
import { Logotipo } from '../Logo/Logo'
import { MenuUsuario } from '@/features/auth'
import estilos from './Header.module.css'

export function Encabezado() {
  const { cantidadTotal, abrirCarrito } = useCarrito()
  const { datos: categorias } = useCategorias()
  const categoriasDisponibles = categorias ?? []

  return (
    <header className={estilos.encabezado}>
      <div className={estilos.barra}>
        <Logotipo clase={estilos.logotipo} />

        <nav className={estilos.navegacion} aria-label="Principal">
          {categoriasDisponibles.map(({ slug, etiqueta }) => (
            <NavLink
              key={slug}
              to={RUTAS.categoria(slug)}
              className={({ isActive: estaActivo }) =>
                unirClases(estilos.enlace, estaActivo && estilos.activo)
              }
            >
              {etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className={estilos.acciones}>
          <MenuUsuario />
          <button
            type="button"
            className={estilos.carrito}
            onClick={abrirCarrito}
            aria-label={`Abrir carrito, ${cantidadTotal} productos`}
          >
            <PiShoppingBagFill aria-hidden="true" />
            {cantidadTotal > 0 && <span className={estilos.contador}>{cantidadTotal}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
