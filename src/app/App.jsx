import { RouterProvider } from 'react-router-dom'
import { ProveedoresApp } from './AppProviders'
import { enrutador } from './routes'

export default function Aplicacion() {
  return (
    <ProveedoresApp>
      <RouterProvider router={enrutador} />
    </ProveedoresApp>
  )
}
