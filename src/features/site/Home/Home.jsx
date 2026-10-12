import { Link } from 'react-router-dom'
import { PiArrowRightBold } from 'react-icons/pi'
import imagenPortada from '@/assets/cover.png'
import { Boton, Contenedor, EstadoVacio } from '@/shared/ui'
import { GrillaProductos, useProductosDestacados } from '@/features/products'
import { RUTAS } from '@/shared/config/constants'
import estilos from './Home.module.css'

export default function Inicio() {
  const { datos: destacados, cargando, error, recargar } = useProductosDestacados()

  return (
    <>
      <Contenedor como="section" clase={estilos.portada}>
        <div>
          <h1 className={estilos.titulo}>
            Todo para tu <span className={estilos.resaltado}>manada</span>, en un solo lugar.
          </h1>
          <p className={estilos.bajada}>
            Alimento, juguetes y accesorios para gatos y perros, elegidos con cariño y pensados para
            cuidar tu bolsillo.
          </p>
          <div className={estilos.acciones}>
            <Boton como={Link} to={RUTAS.TIENDA} tamano="grande" icono={<PiArrowRightBold aria-hidden="true" />}>
              Ver la tienda
            </Boton>
            <Boton como={Link} to={RUTAS.NOSOTROS} tamano="grande" variante="secundario">
              Conocernos
            </Boton>
          </div>
        </div>

        <img
          className={estilos.imagenPortada}
          src={imagenPortada}
          alt="Un perro golden retriever y un gato comiendo de sus platos, rodeados de juguetes"
          width="1562"
          height="941"
        />
      </Contenedor>

      <Contenedor como="section" clase={estilos.seccion} aria-labelledby="destacados">
        <div className={estilos.cabeceraSeccion}>
          <h2 id="destacados" className={estilos.tituloSeccion}>
            Los favoritos de la manada
          </h2>
          <Link to={`${RUTAS.TIENDA}?orden=destacados`} className={estilos.verTodo}>
            Ver todo <PiArrowRightBold aria-hidden="true" />
          </Link>
        </div>

        {error ? (
          <EstadoVacio
            titulo="No pudimos cargar los productos"
            descripcion="Revisá tu conexión e intentá de nuevo."
            accion={<Boton onClick={recargar}>Reintentar</Boton>}
          />
        ) : (
          <GrillaProductos productos={destacados ?? []} cargando={cargando} cantidadEsqueletos={8} />
        )}
      </Contenedor>
    </>
  )
}
