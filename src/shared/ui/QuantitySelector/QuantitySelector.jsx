import { PiMinusBold, PiPlusBold } from 'react-icons/pi'
import { unirClases } from '@/shared/utils/classes'
import estilos from './QuantitySelector.module.css'

export function SelectorCantidad({
  valor,
  alCambiar,
  minimo = 1,
  maximo = Infinity,
  tamano = 'mediano',
  etiqueta = 'Cantidad',
}) {
  return (
    <div className={unirClases(estilos.selector, estilos[tamano])} role="group" aria-label={etiqueta}>
      <button
        type="button"
        className={estilos.control}
        onClick={() => alCambiar(valor - 1)}
        disabled={valor <= minimo}
        aria-label="Quitar una unidad"
      >
        <PiMinusBold aria-hidden="true" />
      </button>
      <output className={estilos.valor} aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        className={estilos.control}
        onClick={() => alCambiar(valor + 1)}
        disabled={valor >= maximo}
        aria-label="Agregar una unidad"
      >
        <PiPlusBold aria-hidden="true" />
      </button>
    </div>
  )
}
