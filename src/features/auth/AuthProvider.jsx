import { useCallback, useEffect, useMemo, useState } from 'react'
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

  const ingresar = useCallback(async (datos) => {
    const usuarioNuevo = await ingresarConEmail(datos)
    setUsuario(usuarioNuevo)
    return usuarioNuevo
  }, [])

  const registrar = useCallback(async (datos) => {
    const usuarioNuevo = await registrarConEmail(datos)
    setUsuario(usuarioNuevo)
    return usuarioNuevo
  }, [])

  const ingresarGoogle = useCallback(async () => {
    const usuarioNuevo = await ingresarConGoogle()
    setUsuario(usuarioNuevo)
    return usuarioNuevo
  }, [])

  const valor = useMemo(
    () => ({
      usuario,
      inicializando,
      estaAutenticado: Boolean(usuario),
      ingresar,
      registrar,
      ingresarConGoogle: ingresarGoogle,
      cerrarSesion,
    }),
    [usuario, inicializando, ingresar, registrar, ingresarGoogle],
  )

  return <ContextoAutenticacion value={valor}>{children}</ContextoAutenticacion>
}
