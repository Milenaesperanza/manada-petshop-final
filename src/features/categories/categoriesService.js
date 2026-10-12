import { collection, getDocs } from 'firebase/firestore'
import { COLECCIONES } from '@/shared/config/constants'
import { baseDeDatos, firebaseConfigurado } from '@/shared/config/firebase'

const etiquetaPorSlug = (slug) => slug.charAt(0).toUpperCase() + slug.slice(1)

const normalizarSlugAnimal = (slug) => {
  const valor = String(slug ?? '').trim().toLowerCase()
  return valor === 'gatos' ? 'gato' : valor === 'perros' ? 'perro' : valor
}

const normalizarCategoria = (instantanea) => {
  const datos = instantanea.data()
  const slugOriginal = String(datos.slug ?? instantanea.id).trim().toLowerCase()
  const slug = normalizarSlugAnimal(slugOriginal)

  return {
    slug,
    etiqueta: datos.etiqueta ?? datos.nombre ?? etiquetaPorSlug(slug),
    singular: datos.singular ?? datos.etiqueta ?? datos.nombre ?? etiquetaPorSlug(slug),
    padre: normalizarSlugAnimal(datos.padre ?? datos.especie ?? datos.categoriaPadre),
    orden: Number(datos.orden ?? 0),
    activa: datos.activa !== false,
  }
}

/** Lee las categorías públicas que se muestran en el menú y en la tienda. */
export const obtenerCategorias = async () => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const resultado = await getDocs(collection(baseDeDatos, COLECCIONES.ANIMALES))
  const categorias = resultado.docs
    .map(normalizarCategoria)
    .filter((categoria) => !categoria.padre && categoria.slug && categoria.activa !== false)
    .sort((a, b) => a.orden - b.orden || a.etiqueta.localeCompare(b.etiqueta, 'es'))

  // Mientras se configura la colección, el catálogo sigue siendo navegable.
  return categorias
}

export const obtenerSubcategorias = async (padre) => {
  if (!firebaseConfigurado) throw new Error('Firebase no está configurado.')

  const resultado = await getDocs(collection(baseDeDatos, COLECCIONES.CATEGORIAS))
  const subcategorias = resultado.docs
    .map(normalizarCategoria)
    .filter(
      (categoria) =>
        categoria.activa !== false &&
        (!padre || !categoria.padre || categoria.padre === padre),
    )
    .sort((a, b) => a.orden - b.orden || a.etiqueta.localeCompare(b.etiqueta, 'es'))

  return subcategorias
}
