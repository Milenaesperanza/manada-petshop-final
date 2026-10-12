import {
  PiHandHeartFill,
  PiLeafFill,
  PiPawPrintFill,
  PiTruckFill,
} from 'react-icons/pi'
import { Contenedor, EncabezadoPagina } from '@/shared/ui'
import { NOMBRE_TIENDA } from '@/shared/config/constants'
import estilos from './About.module.css'

const VALORES = [
  {
    Icono: PiPawPrintFill,
    titulo: 'Primero ellos',
    texto: 'Cada producto pasa por la prueba más exigente: gatos y perros de verdad.',
  },
  {
    Icono: PiHandHeartFill,
    titulo: 'Trato cercano',
    texto: 'Somos un equipo chico que responde cada mensaje como si fuera de la familia.',
  },
]

const BENEFICIOS = [
  { Icono: PiLeafFill, titulo: 'Eco-friendly', texto: 'Materiales reciclados y empaques compostables.' },
  { Icono: PiTruckFill, titulo: 'Envíos a todo el país', texto: 'Llega rápido y bien cuidado a tu puerta.' },]

export default function Nosotros() {
  return (
    <Contenedor>
      <EncabezadoPagina
        titulo={`Somos ${NOMBRE_TIENDA}`}
        descripcion="Nacimos porque creemos que las mascotas no son un accesorio: son parte de la manada."
      />

      <p className={estilos.bajada}>
        Empezamos en un departamento chico con dos gatos, un perro y muchas ganas de encontrar
        productos buenos de verdad. Hoy seleccionamos alimento, juguetes y accesorios que nos
        gustaría tener en casa, y los enviamos a todo el país.
      </p>

      <ul className={estilos.valores} role="list">
        {VALORES.map(({ Icono, titulo, texto }) => (
          <li key={titulo} className={estilos.valor}>
            <span className={estilos.icono}>
              <Icono aria-hidden="true" />
            </span>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </li>
        ))}
      </ul>

      <ul className={estilos.valores} role="list">
        {BENEFICIOS.map(({ Icono, titulo, texto }) => (
          <li key={titulo} className={estilos.valor}>
            <span className={estilos.iconoBeneficio}>
              <Icono aria-hidden="true" />
            </span>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </li>
        ))}
      </ul>
    </Contenedor>
  )
}
