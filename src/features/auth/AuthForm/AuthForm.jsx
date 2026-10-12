import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import aviso from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { Boton, Campo } from '@/shared/ui'
import { RUTAS } from '@/shared/config/constants'
import { useAutenticacion } from '../useAuth'
import { obtenerMensajeErrorAutenticacion } from '../authService'
import estilos from './AuthForm.module.css'

const TEXTOS = {
  ingresar: {
    titulo: 'Bienvenido de vuelta',
    subtitulo: 'Ingresá para ver tus pedidos y comprar más rápido.',
    enviar: 'Ingresar',
    textoAlternar: '¿Todavía no tenés cuenta?',
    etiquetaAlternar: 'Crear cuenta',
    rutaAlternar: RUTAS.REGISTRARSE,
  },
  registrar: {
    titulo: 'Sumate a la manada',
    subtitulo: 'Creá tu cuenta en menos de un minuto.',
    enviar: 'Crear cuenta',
    textoAlternar: '¿Ya tenés cuenta?',
    etiquetaAlternar: 'Ingresar',
    rutaAlternar: RUTAS.INGRESAR,
  },
}

const validar = (modo, valores) => {
  const errores = {}
  if (modo === 'registrar' && !valores.nombre.trim()) errores.nombre = 'Contanos cómo te llamás.'
  if (!/^\S+@\S+\.\S+$/.test(valores.email)) errores.email = 'Ingresá un email válido.'
  if (valores.contrasena.length < 6) errores.contrasena = 'Mínimo 6 caracteres.'
  return errores
}

/** Formulario único para ingresar y registrarse: `modo` = 'ingresar' | 'registrar'. */
export function FormularioAutenticacion({ modo }) {
  const textos = TEXTOS[modo]
  const { ingresar, registrar, ingresarConGoogle } = useAutenticacion()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const rutaDestino = ubicacion.state?.desde ?? RUTAS.FINALIZAR_COMPRA

  const [valores, setValores] = useState({ nombre: '', email: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (evento) => {
    const { name: campo, value: valor } = evento.target
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
    setErrores((anteriores) => ({ ...anteriores, [campo]: undefined }))
  }

  const ejecutar = async (accion, mensajeExito) => {
    setEnviando(true)
    try {
      await accion()
      aviso.success(mensajeExito)
      navegar(rutaDestino, { replace: true })
    } catch (error) {
      aviso.error(obtenerMensajeErrorAutenticacion(error))
    } finally {
      setEnviando(false)
    }
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    const erroresNuevos = validar(modo, valores)
    setErrores(erroresNuevos)
    if (Object.keys(erroresNuevos).length > 0) return

    if (modo === 'ingresar') {
      ejecutar(() => ingresar(valores), '¡Qué bueno verte de nuevo!')
    } else {
      ejecutar(() => registrar(valores), '¡Cuenta creada! Bienvenido a la manada.')
    }
  }

  return (
    <div className={estilos.tarjeta}>
      <h1 className={estilos.titulo}>{textos.titulo}</h1>
      <p className={estilos.subtitulo}>{textos.subtitulo}</p>

      <form className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
        {modo === 'registrar' && (
          <Campo
            etiqueta="Nombre"
            name="nombre"
            autoComplete="name"
            placeholder="Ej: María González"
            value={valores.nombre}
            onChange={manejarCambio}
            error={errores.nombre}
          />
        )}
        <Campo
          etiqueta="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Ej: maria@email.com"
          value={valores.email}
          onChange={manejarCambio}
          error={errores.email}
        />
        <Campo
          etiqueta="Contraseña"
          name="contrasena"
          type="password"
          autoComplete={modo === 'ingresar' ? 'current-password' : 'new-password'}
          placeholder="Mínimo 6 caracteres"
          value={valores.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />

        <Boton type="submit" tamano="grande" anchoCompleto cargando={enviando}>
          {textos.enviar}
        </Boton>
      </form>

      <div className={estilos.divisor}>
        <span>o</span>
      </div>

      <Boton
        variante="secundario"
        tamano="grande"
        anchoCompleto
        icono={<FcGoogle aria-hidden="true" />}
        deshabilitado={enviando}
        onClick={() => ejecutar(ingresarConGoogle, '¡Listo! Ya iniciaste sesión.')}
      >
        Continuar con Google
      </Boton>

      <p className={estilos.alternar}>
        {textos.textoAlternar}{' '}
        <Link to={textos.rutaAlternar} state={ubicacion.state} className={estilos.enlaceAlternar}>
          {textos.etiquetaAlternar}
        </Link>
      </p>
    </div>
  )
}
