import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const configuracionFirebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/**
 * `false` mientras no existan las variables en `.env.local`.
 * Los servicios pueden usar este indicador para evitar consultas sin configuración.
 */
export const firebaseConfigurado = Boolean(
  configuracionFirebase.apiKey && configuracionFirebase.projectId,
)

const aplicacion = firebaseConfigurado ? initializeApp(configuracionFirebase) : null

export const autenticacion = aplicacion ? getAuth(aplicacion) : null
export const baseDeDatos = aplicacion ? getFirestore(aplicacion) : null
export const funciones = aplicacion ? getFunctions(aplicacion) : null
