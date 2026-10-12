import { useMemo, useState } from 'react'
import { Link, useNavigate, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { PiMagnifyingGlass, PiWarningCircle } from 'react-icons/pi'
import { Boton, Contenedor, EncabezadoPagina, EstadoVacio } from '@/shared/ui'
import { GrillaProductos } from '../ProductGrid/ProductGrid'
import { RUTAS } from '@/shared/config/constants'
import { useCategorias, useSubcategorias } from '@/features/categories'
import { useProductos } from '../useProducts'
import { unirClases } from '@/shared/utils/classes'
import NoEncontrada from '@/features/site/NotFound/NotFound'
import estilos from './Store.module.css'

const ORDENAMIENTOS = {
  destacados: { etiqueta: 'Destacados', comparar: (a, b) => b.stock - a.stock },
  'menor-precio': { etiqueta: 'Menor precio', comparar: (a, b) => a.precio - b.precio },
  'mayor-precio': { etiqueta: 'Mayor precio', comparar: (a, b) => b.precio - a.precio },
  nombre: { etiqueta: 'Nombre (A-Z)', comparar: (a, b) => a.nombre.localeCompare(b.nombre, 'es') },
}

const claseSolapa = ({ isActive: estaActiva }) =>
  unirClases(estilos.solapa, estaActiva && estilos.activo)

const normalizarFiltro = (valor) => {
  if (!valor) return ''
  const normalizado = valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return normalizado === 'gatos' ? 'gato' : normalizado === 'perros' ? 'perro' : normalizado
}

/** Catálogo. `/tienda` lista todo; `/tienda/:categoria` filtra por gatos o perros. */
export default function Tienda() {
  const PRODUCTOS_POR_PAGINA = 12
  const { categoria: animalDeRuta, subcategoria: categoriaDeRuta } = useParams()
  const navegar = useNavigate()
  const [parametros] = useSearchParams()
  const { datos: categorias, cargando: cargandoCategorias } = useCategorias()
  const categoriasDisponibles = categorias ?? []
  const animal = normalizarFiltro(animalDeRuta ?? parametros.get('animal'))
  const categoriaProducto = normalizarFiltro(categoriaDeRuta ?? parametros.get('categoria'))
  const categoriaActual = categoriasDisponibles.find((c) => c.slug === animal)
  const categoriaInvalida = animal && !categoriaActual
  const { datos: subcategorias, cargando: cargandoSubcategorias } = useSubcategorias(categoriaActual?.slug)
  const subcategoriaActual = (subcategorias ?? []).find((c) => c.slug === categoriaProducto)
  const subcategoriaInvalida = categoriaProducto && !cargandoSubcategorias && !subcategoriaActual

  const { datos, cargando, error, recargar } = useProductos(
    animal,
    categoriaProducto,
  )
  const [claveOrden, setClaveOrden] = useState(
    () => parametros.get('orden') ?? 'nombre',
  )

  const productos = useMemo(() => {
    const comparar = ORDENAMIENTOS[claveOrden].comparar
    const productosBase = datos ?? []
    return comparar ? [...productosBase].sort(comparar) : productosBase
  }, [datos, claveOrden])

  const paginaSolicitada = Number.parseInt(parametros.get('pagina') ?? '1', 10)
  const totalPaginas = Math.max(1, Math.ceil(productos.length / PRODUCTOS_POR_PAGINA))
  const paginaActual = Math.min(
    Math.max(Number.isNaN(paginaSolicitada) ? 1 : paginaSolicitada, 1),
    totalPaginas,
  )
  const productosVisibles = productos.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA,
  )

  if ((!cargandoCategorias && categoriaInvalida) || subcategoriaInvalida) return <NoEncontrada />

  const cambiarFiltro = (nombre, valor) => {
    const nuevosParametros = new URLSearchParams(parametros)
    if (animalDeRuta && !nuevosParametros.has('animal')) nuevosParametros.set('animal', animalDeRuta)
    if (valor) nuevosParametros.set(nombre, valor)
    else nuevosParametros.delete(nombre)
    nuevosParametros.delete('pagina')
    navegar(`/tienda?${nuevosParametros.toString()}`.replace('?', nuevosParametros.toString() ? '?' : ''))
  }

  const cambiarPagina = (pagina) => {
    const nuevosParametros = new URLSearchParams(parametros)
    nuevosParametros.set('pagina', String(pagina))
    navegar({ search: `?${nuevosParametros.toString()}` })
  }

  return (
    <Contenedor>
      <EncabezadoPagina
        titulo={
          subcategoriaActual
            ? categoriaActual
              ? `${subcategoriaActual.etiqueta} para ${categoriaActual.etiqueta.toLowerCase()}`
              : subcategoriaActual.etiqueta
            : categoriaActual
              ? `Para ${categoriaActual.etiqueta.toLowerCase()}`
              : 'Toda la tienda'
        }
        descripcion="Productos elegidos con cariño. Filtrá por categoría u ordená como prefieras."
      />

      <div className={estilos.barraHerramientas}>
        <label className={estilos.filtro}>
          <span>Animal</span>
          <select
            value={animal ?? ''}
            onChange={(evento) => cambiarFiltro('animal', evento.target.value)}
          >
            <option value="">Todos</option>
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map(({ slug, etiqueta }) => (
              <option key={slug} value={slug}>
                {slug === 'gato' ? 'Gato' : slug === 'perro' ? 'Perro' : etiqueta}
              </option>
            ))}
          </select>
        </label>

        {(
          <label className={estilos.filtro}>
            <span>Filtrar por categoría</span>
            <select
              value={categoriaProducto ?? ''}
              onChange={(evento) => cambiarFiltro('categoria', evento.target.value)}
            >
              <option value="">Todas las categorías</option>
              {(subcategorias ?? []).map(({ slug, etiqueta }) => (
                <option key={slug} value={slug}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </label>
        )}

        <nav className={estilos.solapas} aria-label="Categorías">
          <NavLink to={RUTAS.TIENDA} end className={claseSolapa}>
            Todos
          </NavLink>
          {categoriasDisponibles.map(({ slug, etiqueta }) => (
            <NavLink key={slug} to={RUTAS.categoria(slug)} className={claseSolapa}>
              {etiqueta}
            </NavLink>
          ))}
        </nav>

        <label className={estilos.orden}>
          <span>Orden</span>
          <select value={claveOrden} onChange={(evento) => setClaveOrden(evento.target.value)}>
            {Object.entries(ORDENAMIENTOS).map(([clave, { etiqueta }]) => (
              <option key={clave} value={clave}>
                {etiqueta}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <EstadoVacio
          icono={<PiWarningCircle aria-hidden="true" />}
          titulo="No pudimos cargar los productos"
          descripcion="Revisá tu conexión e intentá de nuevo."
          accion={<Boton onClick={recargar}>Reintentar</Boton>}
        />
      ) : !cargando && productos.length === 0 ? (
        <EstadoVacio
          icono={<PiMagnifyingGlass aria-hidden="true" />}
          titulo="Todavía no hay productos acá"
          descripcion="Estamos reponiendo el stock. Mirá el resto de la tienda mientras tanto."
          accion={
            <Boton como={Link} to={RUTAS.TIENDA} variante="secundario">
              Ver todo
            </Boton>
          }
        />
      ) : (
        <>
          <GrillaProductos productos={productosVisibles} cargando={cargando} />
          {!cargando && totalPaginas > 1 && (
            <nav className={estilos.paginacion} aria-label="Paginación de productos">
              <button
                type="button"
                className={estilos.botonPagina}
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
              <span className={estilos.indicadorPagina}>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                type="button"
                className={estilos.botonPagina}
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </Contenedor>
  )
}
