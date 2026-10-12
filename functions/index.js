const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const { initializeApp } = require('firebase-admin/app')

initializeApp()
const db = getFirestore()

const normalizarCliente = (cliente = {}) => ({
  nombreCompleto: String(cliente.nombreCompleto ?? '').trim(),
  telefono: String(cliente.telefono ?? '').trim(),
  direccion: String(cliente.direccion ?? '').trim(),
  ciudad: String(cliente.ciudad ?? '').trim(),
  codigoPostal: String(cliente.codigoPostal ?? '').trim(),
  pago: {
    metodo: 'tarjeta',
    titular: String(cliente.pago?.titular ?? '').trim(),
    ultimosCuatro: String(cliente.pago?.ultimosCuatro ?? '').replace(/\D/g, '').slice(-4),
    vencimiento: String(cliente.pago?.vencimiento ?? '').trim(),
  },
})

exports.crearPedido = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión para comprar.')
  }

  const articulos = request.data?.articulos
  if (!Array.isArray(articulos) || articulos.length === 0 || articulos.length > 50) {
    throw new HttpsError('invalid-argument', 'El carrito no es válido.')
  }

  const cantidades = new Map()
  for (const articulo of articulos) {
    const id = String(articulo?.id ?? '')
    const cantidad = Number(articulo?.cantidad)
    if (!id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
      throw new HttpsError('invalid-argument', 'Hay una cantidad de producto inválida.')
    }
    cantidades.set(id, (cantidades.get(id) ?? 0) + cantidad)
  }

  const referencias = [...cantidades.keys()].map((id) => db.collection('productos').doc(id))
  const pedidoRef = db.collection('orders').doc()

  await db.runTransaction(async (transaction) => {
    const snapshots = []
    for (const referencia of referencias) snapshots.push(await transaction.get(referencia))

    const items = []
    let total = 0
    snapshots.forEach((snapshot, indice) => {
      if (!snapshot.exists) {
        throw new HttpsError('failed-precondition', 'Uno de los productos ya no existe.')
      }

      const producto = snapshot.data()
      const cantidad = cantidades.get(referencias[indice].id)
      const precio = Number(producto.precio)
      const stock = Number(producto.stock)
      if (!Number.isFinite(precio) || precio < 0 || !Number.isInteger(stock) || stock < cantidad) {
        throw new HttpsError('failed-precondition', 'Stock insuficiente para un producto.')
      }

      items.push({
        id: snapshot.id,
        nombre: String(producto.nombre ?? ''),
        precio,
        cantidad,
        imagen: String(producto.imagen ?? ''),
      })
      total += precio * cantidad
      transaction.update(referencias[indice], { stock: stock - cantidad })
    })

    transaction.create(pedidoRef, {
      usuarioId: request.auth.uid,
      usuarioEmail: request.auth.token.email ?? null,
      cliente: normalizarCliente(request.data.cliente),
      articulos: items,
      total,
      estado: 'pendiente',
      creadoEn: FieldValue.serverTimestamp(),
    })
  })

  return { id: pedidoRef.id }
})
