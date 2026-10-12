import { doc, getDoc, setDoc } from 'firebase/firestore'
import { baseDeDatos, firebaseConfigurado } from '@/shared/config/firebase'

const COLECCION_PERFILES = 'perfiles'

export const obtenerPerfil = async (uid) => {
  if (!uid || !firebaseConfigurado) return null

  const referencia = doc(baseDeDatos, COLECCION_PERFILES, uid)
  const resultado = await getDoc(referencia)
  return resultado.exists() ? resultado.data() : null
}

export const guardarPerfil = async (uid, perfil) => {
  if (!uid || !firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const referencia = doc(baseDeDatos, COLECCION_PERFILES, uid)
  await setDoc(referencia, perfil, { merge: true })
}
