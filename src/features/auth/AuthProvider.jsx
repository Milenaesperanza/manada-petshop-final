import { useEffect, useMemo, useState } from 'react'
import {
  cerrarSesion,
  ingresarConEmail,
  ingresarConGoogle,
  registrarConEmail,
  suscribirseAutenticacion,
} from './authService'
import { ContextoAutenticacion } from './authContext'

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null)
  // `true` hasta que Firebase informe si hay sesión: evita parpadeos en rutas protegidas.
  const [inicializando, setInicializando] = useState(true)

  useEffect(
    () =>
      suscribirseAutenticacion((usuarioNuevo) => {
        setUsuario(usuarioNuevo)
        setInicializando(false)
      }),
    [],
  )

  const valor = useMemo(
    () => ({
      usuario,
      inicializando,
      estaAutenticado: Boolean(usuario),
      ingresar: ingresarConEmail,
      registrar: registrarConEmail,
      ingresarConGoogle,
      cerrarSesion,
    }),
    [usuario, inicializando],
  )

  return <ContextoAutenticacion value={valor}>{children}</ContextoAutenticacion>
}
