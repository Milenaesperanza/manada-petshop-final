import {
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { COLECCIONES } from '@/shared/config/constants'
import { baseDeDatos, firebaseConfigurado } from '@/shared/config/firebase'
const coleccionProductos = () => collection(baseDeDatos, COLECCIONES.PRODUCTOS)
const cacheProductos = new Map()
let productosDestacadosEnCache

const desdeInstantanea = (instantanea) => ({ id: instantanea.id, ...instantanea.data() })

const normalizarValor = (valor) =>
  valor == null
    ? ''
    : String(valor)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

const normalizarAnimal = (valor) => {
  const animal = normalizarValor(valor)
  return animal === 'gatos' ? 'gato' : animal === 'perros' ? 'perro' : animal
}

const normalizarProducto = (producto) => {
  const animal = normalizarAnimal(producto.animal ?? producto.especie)
  const categoria = normalizarValor(producto.subcategoria ?? producto.categoria ?? producto.tipo)

  return {
    ...producto,
    animal,
    categoria,
    precio: Number(producto.precio ?? 0),
    stock: Number(producto.stock ?? 0),
  }
}

/** Lista productos. `categoria` ('gatos' | 'perros') es opcional. */
const cargarProductos = async ({ categoria, subcategoria } = {}) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const resultado = await getDocs(coleccionProductos())
  const productos = resultado.docs.map(desdeInstantanea).map(normalizarProducto)

  return productos.filter((producto) => {
    const animal = producto.animal
    const categoriaInterna = producto.categoria

    const coincideAnimal = !categoria || animal === normalizarAnimal(categoria)
    const coincideCategoria =
      !subcategoria || categoriaInterna === normalizarValor(subcategoria)

    return coincideAnimal && coincideCategoria
  })
}

export const obtenerProductos = ({ categoria, subcategoria } = {}) => {
  const clave = `${categoria ?? ''}:${subcategoria ?? ''}`
  if (!cacheProductos.has(clave)) {
    const promesa = cargarProductos({ categoria, subcategoria })
    promesa.catch(() => cacheProductos.delete(clave))
    cacheProductos.set(clave, promesa)
  }
  return cacheProductos.get(clave)
}

/** Favoritos de la manada: 4 productos por especie, uno por categoría, priorizando stock. */
const cargarProductosDestacados = async () => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')
  const resultado = await getDocs(coleccionProductos())
  const productos = resultado.docs.map(desdeInstantanea).map(normalizarProducto)

  const porAnimal = productos
    .filter((producto) => ['gato', 'perro'].includes(producto.animal))
    .reduce((grupos, producto) => {
      const clave = `${producto.animal}:${producto.categoria}`
      grupos.set(clave, [...(grupos.get(clave) ?? []), producto])
      return grupos
    }, new Map())

  return ['perro', 'gato'].flatMap((animal) => {
    const categorias = [...porAnimal.keys()]
      .filter((clave) => clave.startsWith(`${animal}:`))
      .sort((claveA, claveB) => {
        const stockA = Math.max(...porAnimal.get(claveA).map((producto) => producto.stock))
        const stockB = Math.max(...porAnimal.get(claveB).map((producto) => producto.stock))
        return stockB - stockA
      })
      .slice(0, 4)

    return categorias.map((categoria) => {
      const productosDeCategoria = porAnimal.get(categoria)
      return [...productosDeCategoria].sort((a, b) => b.stock - a.stock)[0]
    })
  })
}

export const obtenerProductosDestacados = () => {
  if (!productosDestacadosEnCache) {
    productosDestacadosEnCache = cargarProductosDestacados()
    productosDestacadosEnCache.catch(() => {
      productosDestacadosEnCache = undefined
    })
  }
  return productosDestacadosEnCache
}

/** Devuelve el producto o `null` si no existe. */
export const obtenerProductoPorId = async (id) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const instantanea = await getDoc(doc(baseDeDatos, COLECCIONES.PRODUCTOS, id))
  return instantanea.exists() ? normalizarProducto(desdeInstantanea(instantanea)) : null
}
