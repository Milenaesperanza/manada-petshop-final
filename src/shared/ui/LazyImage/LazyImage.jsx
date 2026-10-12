import { useEffect, useRef, useState } from 'react'
import { PiPawPrintFill } from 'react-icons/pi'
import { unirClases } from '@/shared/utils/classes'
import estilos from './LazyImage.module.css'

/**
 * Imagen con carga diferida y marcador de posición.
 * - Reserva el espacio con `proporcion` (sin saltos de layout).
 * - Muestra brillo mientras descarga y un ícono si no hay `origen` o falla.
 * tono: arcilla | cielo (tinte del marcador según la categoría)
 */
export function ImagenPerezosa({
  origen,
  textoAlternativo,
  proporcion = '1 / 1',
  tono = 'arcilla',
  prioritaria = false,
  clase,
}) {
  const referenciaImagen = useRef(null)
  const [estado, setEstado] = useState(origen ? 'cargando' : 'vacia')

  // Si la imagen ya estaba en caché, `onLoad` pudo dispararse antes de hidratar.
  useEffect(() => {
    if (referenciaImagen.current?.complete && referenciaImagen.current.naturalWidth > 0) {
      setEstado('cargada')
    }
  }, [])

  const mostrarMarcador = estado !== 'cargada'

  return (
    <div
      className={unirClases(estilos.marco, estilos[tono], clase)}
      style={{ aspectRatio: proporcion }}
    >
      {mostrarMarcador && (
        <div
          className={unirClases(estilos.marcador, estado === 'cargando' && estilos.brillo)}
          role={estado === 'cargando' ? undefined : 'img'}
          aria-label={estado === 'cargando' ? undefined : textoAlternativo}
        >
          {estado !== 'cargando' && <PiPawPrintFill className={estilos.icono} aria-hidden="true" />}
        </div>
      )}

      {origen && estado !== 'error' && (
        <img
          ref={referenciaImagen}
          className={unirClases(estilos.imagen, estado === 'cargada' && estilos.visible)}
          src={origen}
          alt={textoAlternativo}
          loading={prioritaria ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={prioritaria ? 'high' : 'auto'}
          onLoad={() => setEstado('cargada')}
          onError={() => setEstado('error')}
        />
      )}
    </div>
  )
}
