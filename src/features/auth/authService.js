import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { autenticacion, firebaseConfigurado } from '@/shared/config/firebase'
import { guardarPerfil } from './profileService'

const ERRORES_AUTENTICACION = {
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ese email ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo en unos minutos.',
  'auth/popup-closed-by-user': 'Cerraste la ventana antes de terminar.',
  'auth/network-request-failed': 'Sin conexión. Revisá tu internet.',
}

/** Traduce los errores de Firebase a mensajes para mostrar al usuario. */
export const obtenerMensajeErrorAutenticacion = (error) =>
  ERRORES_AUTENTICACION[error?.code] ?? error?.message ?? 'Ocurrió un error inesperado.'

/** Convierte el usuario de Firebase en el objeto plano que usa la app. */
const aUsuarioApp = (usuarioFirebase) =>
  usuarioFirebase && {
    uid: usuarioFirebase.uid,
    email: usuarioFirebase.email,
    nombre: usuarioFirebase.displayName,
    fotoUrl: usuarioFirebase.photoURL,
  }

/** Escucha cambios de sesión. Devuelve la función para desuscribirse. */
export const suscribirseAutenticacion = (alCambiar) => {
  if (!firebaseConfigurado) {
    alCambiar(null)
    return () => {}
  }
  return onAuthStateChanged(autenticacion, (usuario) => alCambiar(aUsuarioApp(usuario)))
}

export const registrarConEmail = async ({ nombre, email, contrasena }) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')
  const { user: usuario } = await createUserWithEmailAndPassword(autenticacion, email, contrasena)
  await updateProfile(usuario, { displayName: nombre })
  await guardarPerfil(usuario.uid, { nombreCompleto: nombre })
  return aUsuarioApp({ ...usuario, displayName: nombre })
}

export const ingresarConEmail = async ({ email, contrasena }) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')
  const { user: usuario } = await signInWithEmailAndPassword(autenticacion, email, contrasena)
  return aUsuarioApp(usuario)
}

export const ingresarConGoogle = async () => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')
  const { user: usuario } = await signInWithPopup(autenticacion, new GoogleAuthProvider())
  return aUsuarioApp(usuario)
}

export const cerrarSesion = async () => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')
  await signOut(autenticacion)
}
