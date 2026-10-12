import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Aplicacion from '@/app/App'
import '@/app/variables.css'
import '@/app/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
)
