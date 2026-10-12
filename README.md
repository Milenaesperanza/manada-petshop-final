# Manada PetShop

E-commerce de mascotas (categorías **gatos** y **perros**) hecho con React + Vite. Productos, pedidos y usuarios viven en Firebase (Firestore + Auth).

Todo el código propio está nombrado en español (variables, funciones, componentes, hooks, archivos, clases CSS y campos de Firestore). Solo se mantienen en inglés los nombres que imponen las librerías (React, Firebase, DOM, react-router, etc.).

## Stack

| Para qué | Librería |
| --- | --- |
| Framework / bundler | React 19 + Vite |
| Rutas | react-router-dom |
| Backend | Firebase (Auth + Firestore) |
| Íconos | react-icons (set Phosphor `pi` + `fc` para Google) |
| Componentes accesibles | Radix UI (Dialog del carrito, Dropdown del usuario) |
| Avisos (toasts) | react-hot-toast |
| Tipografías | Google Fonts: Fredoka (títulos) y Nunito (texto) |
| Estilos | CSS Modules + variables de diseño (paleta Claude) |

## Empezar

```bash
npm install
npm run dev
```

## Conectar Firebase

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com) y agregá una **app web**.
2. Activá **Authentication** → métodos *Email/Contraseña* y *Google*.
3. Activá **Firestore Database**.
4. Copiá `.env.example` a `.env.local` y completá las credenciales.
5. Pegá las reglas de `firestore.rules` en Firestore → Reglas.
6. Cargá las categorías en `categorias` y los productos en `productos` (ver abajo). Reiniciá `npm run dev`.

**`categorias/{id}`**

```json
{
  "slug": "gatos",
  "etiqueta": "Gatos",
  "singular": "Gato",
  "orden": 1,
  "activa": true
}
```

`slug` debe coincidir con el campo `categoria` de los productos y se usa en la URL (`/tienda/gatos`). Si no cargás documentos todavía, los filtros y el menú quedan vacíos.

Para las categorías internas, usá documentos en la misma colección con `padre` igual a `gatos` o `perros`:

```json
{
  "slug": "alimentos",
  "etiqueta": "Alimentos",
  "padre": "gatos",
  "orden": 1,
  "activa": true
}
```

Los productos deben incluir `subcategoria` además de `categoria`, por ejemplo `categoria: "gatos"` y `subcategoria: "alimentos"`.

### Modelo de datos

**`productos/{id}`**

```json
{
  "nombre": "Rascador torre de sisal",
  "descripcion": "…",
  "precio": 48900,
  "categoria": "gatos",
  "imagen": "https://…",
  "stock": 12,
  "destacado": true
}
```

`categoria` sólo admite `"gatos"` o `"perros"`. Cada documento debe tener un ID y los campos indicados arriba.

**`orders/{id}`** — lo crea la app al confirmar la compra: `usuarioId`, `usuarioEmail`, `cliente` (`nombreCompleto`, `telefono`, `direccion`, `ciudad`), `articulos[]` (`id`, `nombre`, `precio`, `cantidad`, `imagen`), `total`, `estado` (`pendiente` | `pagado` | `enviado` | `entregado` | `cancelado`) y `creadoEn` (timestamp del servidor).

> Con una colección vacía el catálogo se ve vacío hasta que cargues productos en Firestore.

## Arquitectura

```
src/
├── app/              Composición de la app: App, AppProviders, routes (páginas lazy), estilos globales
│   └── layout/         Esqueleto del sitio: MainLayout, Header, Footer, TextRibbon, Logo
├── shared/           Lo que usa todo el proyecto y no conoce ninguna funcionalidad
│   ├── ui/             Piezas genéricas: Button, Field, Badge, Skeleton, LazyImage, PageHeader…
│   ├── config/         firebase.js (init + indicador firebaseConfigurado) y constants.js (categorías, rutas, moneda)
│   └── utils/          unirClases, formatearPrecio/Fecha y useAsyncData
└── features/         Una carpeta por dominio, con sus páginas, componentes, estado y servicios
    ├── auth/           AuthPage, AuthForm, ProtectedRoute, UserMenu, sesión y authService
    ├── cart/           CartPanel, CartItem, CartProvider (localStorage) y useCart
    ├── products/       Store, ProductDetail, ProductCard, ProductGrid y productsService
    ├── orders/         Checkout, MyOrders, ordersService y useOrders
    └── site/           Páginas informativas: Home, About, NotFound
```

**Rutas:** `/` · `/tienda` · `/tienda/gatos` · `/tienda/perros` · `/producto/:id` · `/nosotros` · `/ingresar` · `/registro` · `/finalizar-compra` y `/mis-pedidos` (estas dos últimas permiten continuar según el estado de sesión; `/mis-pedidos` requiere sesión).

**Reglas del proyecto**

- **Capas con una sola dirección:** `app → features → shared` (una funcionalidad sólo toca a otra a través de su `index.js`, y `shared` no importa nada de las demás). Los componentes nunca importan `firebase/*`; sólo los servicios (`*Service.js`) y `shared/config/firebase.js`.
- **Cambiar de backend** (otro proveedor, una API propia) implica editar únicamente los `*Service.js` de cada funcionalidad.
- **Estilos:** cada componente tiene su `Componente.module.css` al lado y consume variables de `variables.css`. No hay colores ni tamaños sueltos.
- **Barriles:** `shared/ui`, `app/layout` y cada funcionalidad exportan desde un `index.js` para importar limpio: `import { Boton } from '@/shared/ui'`. Las páginas no van en los barriles para que `React.lazy` pueda separarlas en fragmentos. El alias `@` apunta a `src/`.

## Rendimiento

- **Esqueletos** con la misma estructura que el contenido real (sin saltos de layout) en catálogo, detalle, pedidos y carga de páginas.
- **`ImagenPerezosa`:** reserva el espacio con `aspect-ratio`, usa `loading="lazy"` + `decoding="async"`, y muestra un marcador (brillo / ícono) mientras carga, si no hay URL o si la imagen falla.
- **División de código:** cada página es un fragmento (`React.lazy`) y Firebase / React van en fragmentos de vendor para cachearse mejor.
- Respeta `prefers-reduced-motion`.

## Personalización rápida

- Colores y tipografías → [src/app/variables.css](src/app/variables.css) y `<link>` de Google Fonts en [index.html](index.html).
- Moneda, categorías, rutas y nombre de la tienda → [src/shared/config/constants.js](src/shared/config/constants.js).
- Textos de contacto (dirección, email, teléfono) → `PieDePagina.jsx`.

## Scripts

`npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Pendiente (fuera del alcance actual)

- Pasarela de pagos (hoy el pedido queda en estado `pendiente`).
- Panel de administración para cargar productos y cambiar el estado de los pedidos.
- El descuento de stock se realiza al confirmar la compra mediante una transacción de Firestore.
