import { useEffect, useState } from 'react'
import aviso from 'react-hot-toast'
import { Boton, Campo, Contenedor, EncabezadoPagina } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { Link } from 'react-router-dom'
import { useAutenticacion } from '../useAuth'
import { guardarPerfil, obtenerPerfil } from '../profileService'
import estilos from './Profile.module.css'

export default function Perfil() {
  const { usuario } = useAutenticacion()
  const [valores, setValores] = useState({
    nombreCompleto: usuario.nombre ?? '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    obtenerPerfil(usuario.uid)
      .then((perfil) => {
        if (activo && perfil) setValores((anteriores) => ({ ...anteriores, ...perfil }))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => { activo = false }
  }, [usuario.uid])

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    guardarPerfil(usuario.uid, valores)
      .then(() => aviso.success('Guardamos tus datos de entrega.'))
      .catch(() => aviso.error('No pudimos guardar tus datos.'))
  }

  return (
    <Contenedor>
      <EncabezadoPagina
        titulo="Mi perfil"
        descripcion="Guardá tus datos de entrega para completar más rápido tus compras."
      />
      <div className={estilos.disposicion}>
        <form className={estilos.formulario} onSubmit={manejarEnvio}>
          <Campo etiqueta="Nombre y apellido" name="nombreCompleto" autoComplete="name" placeholder="Ej: María González" value={valores.nombreCompleto} onChange={manejarCambio} />
          <div className={estilos.fila}>
            <Campo etiqueta="Teléfono" name="telefono" type="tel" autoComplete="tel" placeholder="Ej: 11 1234-5678" value={valores.telefono} onChange={manejarCambio} />
            <Campo etiqueta="Ciudad" name="ciudad" autoComplete="address-level2" placeholder="Ej: Buenos Aires" value={valores.ciudad} onChange={manejarCambio} />
          </div>
          <div className={estilos.fila}>
            <Campo etiqueta="Dirección" name="direccion" autoComplete="street-address" placeholder="Ej: Av. Corrientes 1234" value={valores.direccion} onChange={manejarCambio} />
            <Campo etiqueta="Código postal" name="codigoPostal" inputMode="numeric" autoComplete="postal-code" placeholder="Ej: 1414" value={valores.codigoPostal} onChange={manejarCambio} />
          </div>
          <Boton type="submit" tamano="grande" deshabilitado={cargando}>Guardar datos</Boton>
        </form>
        <div className={estilos.enlacePedidos}>
          <Boton como={Link} to={RUTAS.PEDIDOS} variante="secundario" tamano="grande">Ver mis pedidos</Boton>
        </div>
      </div>
    </Contenedor>
  )
}
