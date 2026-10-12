import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { COLECCIONES } from '@/shared/config/constants'
import { baseDeDatos, firebaseConfigurado } from '@/shared/config/firebase'

const ordenarMasRecientesPrimero = (pedidos) =>
  [...pedidos].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))

const errorDeStock = (id, stockDisponible, cantidadSolicitada) => {
  const error = new Error(`Stock insuficiente para ${id}`)
  error.code = 'stock-insuficiente'
  error.stockDisponible = stockDisponible
  error.cantidadSolicitada = cantidadSolicitada
  return error
}

/**
 * Crea un pedido de compra.
 * @param {{ usuario: {uid: string, email: string}, articulos: object[], cliente: object, total: number }} datos
 * @returns {Promise<string>} id del pedido
 */
export const crearPedido = async ({ usuario, articulos, cliente, total }) => {
  const pedido = {
    usuarioId: usuario.uid,
    usuarioEmail: usuario.email,
    cliente,
    articulos: articulos.map(({ id, nombre, precio, cantidad, imagen }) => ({
      id,
      nombre,
      precio,
      cantidad,
      imagen,
    })),
    total,
    estado: 'pendiente',
  }

  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const referenciaPedido = doc(collection(baseDeDatos, COLECCIONES.PEDIDOS))
  const referenciasProductos = articulos.map((articulo) => ({
    articulo,
    referencia: doc(baseDeDatos, COLECCIONES.PRODUCTOS, articulo.id),
  }))

  await runTransaction(baseDeDatos, async (transaccion) => {
    const instantaneas = await Promise.all(
      referenciasProductos.map(({ referencia }) => transaccion.get(referencia)),
    )

    referenciasProductos.forEach(({ articulo, referencia }, indice) => {
      const instantanea = instantaneas[indice]
      if (!instantanea.exists()) throw errorDeStock(articulo.id, 0, articulo.cantidad)

      const stockActual = Number(instantanea.data().stock ?? 0)
      if (stockActual < articulo.cantidad) {
        throw errorDeStock(articulo.id, stockActual, articulo.cantidad)
      }

      transaccion.update(referencia, { stock: stockActual - articulo.cantidad })
    })

    transaccion.set(referenciaPedido, {
      ...pedido,
      creadoEn: serverTimestamp(),
    })
  })
  return referenciaPedido.id
}

/** Pedidos del usuario, del más nuevo al más viejo. */
export const obtenerPedidosDeUsuario = async (uid) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  // Se ordena en el cliente para no exigir un índice compuesto en Firestore.
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
