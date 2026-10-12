import { MONEDA } from '@/shared/config/constants'

const formateadorMoneda = new Intl.NumberFormat(MONEDA.idioma, {
  style: 'currency',
  currency: MONEDA.codigo,
  maximumFractionDigits: 0,
})

const formateadorFecha = new Intl.DateTimeFormat(MONEDA.idioma, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatearPrecio = (valor) => formateadorMoneda.format(valor)

export const formatearFecha = (fechaIso) =>
  fechaIso ? formateadorFecha.format(new Date(fechaIso)) : ''
