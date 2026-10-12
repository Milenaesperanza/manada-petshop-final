import { Link } from 'react-router-dom'
import {
  PiClock,
  PiEnvelopeSimple,
  PiFacebookLogo,
  PiInstagramLogo,
  PiMapPin,
  PiTiktokLogo,
  PiWhatsappLogo,
} from 'react-icons/pi'
import { Contenedor } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { Logotipo } from '../Logo/Logo'
import estilos from './Footer.module.css'

const REDES = [
  { Icono: PiTiktokLogo, nombre: 'TikTok', url: 'https://www.tiktok.com/@manadapetshop' },
  { Icono: PiInstagramLogo, nombre: 'Instagram', url: 'https://www.instagram.com/manadapetshop' },
  { Icono: PiFacebookLogo, nombre: 'Facebook', url: 'https://www.facebook.com/manadapetshop' },
]

export function PieDePagina() {
  return (
    <footer className={estilos.pie}>
      <Contenedor clase={estilos.grilla}>
        <div className={estilos.identidad}>
          <Logotipo claro />
          <div className={estilos.logoRedes}>
            <p className={estilos.lema}>Todo lo que necesita tu manada, elegido con cariño y pensado para tu economía.</p>
          <ul className={estilos.redes} role="list">
            {REDES.map(({ Icono, nombre, url }) => (
              <li key={nombre}>
                <a href={url} className={estilos.red} target="_blank" rel="noopener noreferrer" aria-label={nombre}>
                  <Icono aria-hidden="true" />
                </a>
              </li>
            ))}
            </ul>
          </div>
        </div>

        <address className={estilos.columna}>
          <h2 className={estilos.titular}>Visitanos</h2>
          <span className={estilos.informacion}>
            <PiMapPin aria-hidden="true" /> Av. Corrientes 1234, Buenos Aires
          </span>
          <span className={estilos.informacion}>
            <PiClock aria-hidden="true" /> Lunes a sábados de 9 a 19 h
          </span>
        </address>

        <address className={estilos.columna}>
          <h2 className={estilos.titular}>Contactanos</h2>
          <a href="https://wa.me/541123456789" className={estilos.informacion} target="_blank" rel="noopener noreferrer">
            <PiWhatsappLogo aria-hidden="true" /> +54 11 2345-6789
          </a>
          <a href="mailto:hola@manadapetshop.com" className={estilos.informacion}>
            <PiEnvelopeSimple aria-hidden="true" /> hola@manadapetshop.com
          </a>
        </address>

        <nav className={estilos.columna} aria-labelledby="pie-nosotros">
          <h2 id="pie-nosotros" className={estilos.titular}>Nosotros</h2>
          <Link to={RUTAS.NOSOTROS} className={estilos.enlace}>Quiénes somos</Link>
          <Link to={RUTAS.TERMINOS} className={estilos.enlace}>Términos y condiciones</Link>
          <Link to={RUTAS.PRIVACIDAD} className={estilos.enlace}>Políticas de privacidad</Link>
          <Link to={RUTAS.ARREPENTIMIENTO} className={estilos.enlace}>Botón de arrepentimiento</Link>
        </nav>
      </Contenedor>
    </footer>
  )
}
