import { Toaster } from 'react-hot-toast'
import { ProveedorAutenticacion } from '@/features/auth'
import { ProveedorCarrito } from '@/features/cart'

/** Proveedores globales. Sumá acá cualquier contexto nuevo. */
export function ProveedoresApp({ children }) {
  return (
    <ProveedorAutenticacion>
      <ProveedorCarrito>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              border: '1.5px solid var(--color-avena)',
              borderRadius: '999px',
              background: 'var(--color-marfil)',
              color: 'var(--color-tinta)',
              fontFamily: 'var(--fuente-cuerpo)',
              fontWeight: 600,
              boxShadow: 'var(--sombra-mediana)',
            },
            success: { iconTheme: { primary: 'var(--color-oliva)', secondary: 'var(--color-marfil)' } },
            error: { iconTheme: { primary: 'var(--color-peligro)', secondary: 'var(--color-marfil)' } },
          }}
        />
      </ProveedorCarrito>
    </ProveedorAutenticacion>
  )
}
