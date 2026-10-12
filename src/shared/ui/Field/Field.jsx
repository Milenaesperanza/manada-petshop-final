import { useId } from 'react'
import { unirClases } from '@/shared/utils/classes'
import estilos from './Field.module.css'

/** Campo de texto con etiqueta y mensaje de error accesibles. */
export function Campo({ etiqueta, error, clase, multilinea = false, ...propsEntrada }) {
  const id = useId()
  const idError = `${id}-error`

  return (
    <div className={unirClases(estilos.campo, clase)}>
      <label className={estilos.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      {multilinea ? <textarea
        id={id}
        className={unirClases(estilos.entrada, error && estilos.invalido)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...propsEntrada}
      /> : <input
        id={id}
        className={unirClases(estilos.entrada, error && estilos.invalido)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...propsEntrada}
      />}
      {error && (
        <p id={idError} className={estilos.error}>
          {error}
        </p>
      )}
    </div>
  )
}
