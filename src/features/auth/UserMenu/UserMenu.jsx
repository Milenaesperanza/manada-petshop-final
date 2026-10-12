import { Link, useNavigate } from 'react-router-dom'
import * as MenuDesplegable from '@radix-ui/react-dropdown-menu'
import aviso from 'react-hot-toast'
import { PiPackage, PiSignOut, PiUserCircleFill } from 'react-icons/pi'
import { RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '../useAuth'
import { obtenerMensajeErrorAutenticacion } from '../authService'
import estilos from './UserMenu.module.css'

export function MenuUsuario() {
  const { usuario, inicializando, cerrarSesion } = useAutenticacion()
  const navegar = useNavigate()

  const manejarCierreSesion = async () => {
    try {
      await cerrarSesion()
      aviso.success('Cerraste sesión. ¡Hasta pronto!')
      navegar(RUTAS.INICIO)
    } catch (error) {
      aviso.error(obtenerMensajeErrorAutenticacion(error))
    }
  }

  if (inicializando) {
    return <span className={estilos.marcador} aria-hidden="true" />
  }

  if (!usuario) {
    return (
      <Link to={RUTAS.INGRESAR} className={estilos.disparador}>
        <PiUserCircleFill className={estilos.avatar} aria-hidden="true" />
        <span className={estilos.etiqueta}>Ingresar</span>
      </Link>
    )
  }

  const primerNombre = usuario.nombre?.split(' ')[0] ?? usuario.email

  return (
    <MenuDesplegable.Root>
      <MenuDesplegable.Trigger className={estilos.disparador}>
        <PiUserCircleFill className={estilos.avatar} aria-hidden="true" />
        <span className={estilos.etiqueta}>{primerNombre}</span>
      </MenuDesplegable.Trigger>

      <MenuDesplegable.Portal>
        <MenuDesplegable.Content className={estilos.contenido} align="end" sideOffset={10}>
          <MenuDesplegable.Label className={estilos.correo}>{usuario.email}</MenuDesplegable.Label>
          <MenuDesplegable.Item asChild>
            <Link to={RUTAS.PERFIL} className={estilos.elemento}>
              <PiUserCircleFill aria-hidden="true" /> Mi perfil
            </Link>
          </MenuDesplegable.Item>
          <MenuDesplegable.Item asChild>
            <Link to={RUTAS.PEDIDOS} className={estilos.elemento}>
              <PiPackage aria-hidden="true" /> Mis pedidos
            </Link>
          </MenuDesplegable.Item>
          <MenuDesplegable.Separator className={estilos.separador} />
          <MenuDesplegable.Item className={estilos.elemento} onSelect={manejarCierreSesion}>
            <PiSignOut aria-hidden="true" /> Cerrar sesión
          </MenuDesplegable.Item>
        </MenuDesplegable.Content>
      </MenuDesplegable.Portal>
    </MenuDesplegable.Root>
  )
}
