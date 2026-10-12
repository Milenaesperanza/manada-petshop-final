import { obtenerPedidosDeUsuario } from './ordersService'
import { useDatosAsincronos } from '@/shared/utils/useAsyncData'

export const usePedidos = (uid) => useDatosAsincronos(() => obtenerPedidosDeUsuario(uid), [uid])
