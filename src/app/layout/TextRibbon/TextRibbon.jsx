import { PiPawPrintFill } from 'react-icons/pi'
import estilos from './TextRibbon.module.css'

const MENSAJES = [
  'Pensado para ellos',
  'Envío gratis a todo el país',
  'Hecho con cariño',
]

/** Cinta de texto en bucle infinito. El segundo grupo es decorativo (aria-hidden). */
export function CintaTexto() {
  const grupo = (oculto) => (
    <ul className={estilos.grupo} aria-hidden={oculto || undefined}>
      {MENSAJES.map((mensaje) => (
        <li key={mensaje} className={estilos.elemento}>
          {mensaje}
          <PiPawPrintFill className={estilos.icono} aria-hidden="true" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={estilos.cinta}>
      <div className={estilos.pista}>
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}
