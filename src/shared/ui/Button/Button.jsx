import { unirClases } from '@/shared/utils/classes'
import estilos from './Button.module.css'

/**
 * Botón polimórfico: `como={Link} to="/tienda"` lo renderiza como enlace.
 * variante: primario | secundario | oscuro | fantasma — tamano: chico | mediano | grande
 */
export function Boton({
  como: Componente = 'button',
  variante = 'primario',
  tamano = 'mediano',
  anchoCompleto = false,
  cargando = false,
  icono,
  clase,
  children,
  deshabilitado,
  ...props
}) {
  const esBotonNativo = Componente === 'button'

  return (
    <Componente
      className={unirClases(
        estilos.boton,
        estilos[variante],
        estilos[tamano],
        anchoCompleto && estilos.anchoCompleto,
        clase,
      )}
      {...(esBotonNativo && {
        type: props.type ?? 'button',
        disabled: deshabilitado || cargando,
      })}
      aria-busy={cargando || undefined}
      {...props}
    >
      {cargando ? <span className={estilos.indicadorCarga} aria-hidden="true" /> : icono}
      {children}
    </Componente>
  )
}
