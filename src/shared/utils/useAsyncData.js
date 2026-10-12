import { useCallback, useEffect, useState } from 'react'

/**
 * Ejecuta `obtener` al montar y cada vez que cambian `dependencias` (valores primitivos).
 * Ignora respuestas obsoletas (cambio rápido de categoría, desmontaje).
 *
 * `cargando` se deriva de comparar la clave del último resultado con la clave
 * actual, así no hace falta resetear estado dentro del efecto.
 *
 * @returns {{ datos: any, cargando: boolean, error: Error | null, recargar: () => void }}
 */
export function useDatosAsincronos(obtener, dependencias = []) {
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null })

  const clave = JSON.stringify([...dependencias, intento])

  useEffect(() => {
    let cancelado = false

    obtener()
      .then((datos) => !cancelado && setResultado({ clave, datos, error: null }))
      .catch((error) => !cancelado && setResultado({ clave, datos: null, error }))

    return () => {
      cancelado = true
    }
    // `obtener` cambia en cada render; `clave` resume las dependencias reales.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  const recargar = useCallback(() => setIntento((n) => n + 1), [])

  const resuelto = resultado.clave === clave
  return {
    datos: resuelto ? resultado.datos : null,
    error: resuelto ? resultado.error : null,
    cargando: !resuelto,
    recargar,
  }
}
