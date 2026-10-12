const CLAVE_PERFILES = 'manada:perfiles'

const leerPerfiles = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PERFILES)) ?? {}
  } catch {
    return {}
  }
}

export const obtenerPerfil = (uid) => {
  if (!uid) return null
  return leerPerfiles()[uid] ?? null
}

export const guardarPerfil = (uid, perfil) => {
  if (!uid) return
  const perfiles = leerPerfiles()
  localStorage.setItem(CLAVE_PERFILES, JSON.stringify({ ...perfiles, [uid]: perfil }))
}
