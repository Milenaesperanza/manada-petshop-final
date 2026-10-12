import estilos from './PageHeader.module.css'

/** Encabezado estándar de página: título + bajada opcional + acciones a la derecha. */
export function EncabezadoPagina({ titulo, descripcion, children }) {
  return (
    <div className={estilos.encabezado}>
      <div>
        <h1 className={estilos.titulo}>{titulo}</h1>
        {descripcion && <p className={estilos.descripcion}>{descripcion}</p>}
      </div>
      {children}
    </div>
  )
}
