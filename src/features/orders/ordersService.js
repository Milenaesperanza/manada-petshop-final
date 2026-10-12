import { collection, getDocs, query, where } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { COLECCIONES } from '@/shared/config/constants'
import { baseDeDatos, firebaseConfigurado, funciones } from '@/shared/config/firebase'

const ordenarMasRecientesPrimero = (pedidos) =>
  [...pedidos].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))

/** El backend recalcula precios y stock usando los documentos reales. */
export const crearPedido = async ({ articulos, cliente }) => {
  if (!firebaseConfigurado || !funciones) throw new Error('Firebase no está configurado.')

  const ejecutarCrearPedido = httpsCallable(funciones, 'crearPedido')
  const respuesta = await ejecutarCrearPedido({
    articulos: articulos.map(({ id, cantidad }) => ({ id, cantidad })),
    cliente,
  })
  return respuesta.data.id
}

/** Pedidos del usuario, del más nuevo al más viejo. */
export const obtenerPedidosDeUsuario = async (uid) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const consulta = query(collection(baseDeDatos, COLECCIONES.PEDIDOS), where('usuarioId', '==', uid))
  const resultado = await getDocs(consulta)
  const pedidos = resultado.docs.map((instantanea) => {
    const datos = instantanea.data()
    return {
      id: instantanea.id,
      ...datos,
      creadoEn: datos.creadoEn?.toDate?.().toISOString() ?? null,
    }
  })
  return ordenarMasRecientesPrimero(pedidos)
}
