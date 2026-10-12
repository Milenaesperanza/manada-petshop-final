import {
  obtenerProductoPorId,
  obtenerProductos,
  obtenerProductosDestacados,
} from './productsService'
import { useDatosAsincronos } from '@/shared/utils/useAsyncData'

export const useProductos = (categoria, subcategoria) =>
  useDatosAsincronos(() => obtenerProductos({ categoria, subcategoria }), [categoria, subcategoria])

export const useProductosDestacados = (maximo) =>
  useDatosAsincronos(() => obtenerProductosDestacados(maximo), [maximo])

export const useProducto = (id) => useDatosAsincronos(() => obtenerProductoPorId(id), [id])
