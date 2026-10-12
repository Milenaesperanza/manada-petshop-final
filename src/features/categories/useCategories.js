import { useDatosAsincronos } from '@/shared/utils/useAsyncData'
import { obtenerCategorias, obtenerSubcategorias } from './categoriesService'

export const useCategorias = () => useDatosAsincronos(obtenerCategorias, [])

export const useSubcategorias = (padre) =>
  useDatosAsincronos(() => obtenerSubcategorias(padre), [padre])
