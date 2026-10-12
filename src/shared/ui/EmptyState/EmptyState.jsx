import estilos from './EmptyState.module.css'

/** Estado vacío / error: ícono grande + mensaje + acción opcional. */
export function EstadoVacio({ icono, titulo, descripcion, accion }) {
  return (
    <div className={estilos.vacio}>
      {icono && <div className={estilos.icono}>{icono}</div>}
      <h2 className={estilos.titulo}>{titulo}</h2>
      {descripcion && <p className={estilos.descripcion}>{descripcion}</p>}
      {accion}
    </div>
  )
}
