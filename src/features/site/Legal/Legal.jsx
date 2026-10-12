import { Contenedor, EncabezadoPagina } from '@/shared/ui'
import estilos from './Legal.module.css'

const DOCUMENTOS = {
  terminos: {
    titulo: 'Términos y condiciones',
    descripcion: 'Las reglas básicas para comprar en nuestra tienda.',
    secciones: [
      {
        titulo: 'Precios y pagos',
        texto: 'Los precios están expresados en pesos argentinos e incluyen impuestos. Pueden cambiar sin previo aviso, pero el precio que ves al confirmar tu pedido es el que pagás.',
      },
      {
        titulo: 'Envíos',
        texto: 'Enviamos a todo el país. Los plazos dependen de tu zona y se informan al finalizar la compra.',
      },
      {
        titulo: 'Cambios y devoluciones',
        texto: 'Si el producto llegó dañado o no es el que pediste, escribinos dentro de los 10 días de recibido y lo resolvemos.',
      },
    ],
  },
  privacidad: {
    titulo: 'Políticas de privacidad',
    descripcion: 'Cómo cuidamos tus datos.',
    secciones: [
      {
        titulo: 'Qué datos guardamos',
        texto: 'Solo los necesarios para procesar tus pedidos: nombre, email, dirección de entrega y el historial de compras.',
      },
      {
        titulo: 'Para qué los usamos',
        texto: 'Para gestionar tus compras y contactarte por ellas. No vendemos ni compartimos tus datos con terceros ajenos al servicio.',
      },
      {
        titulo: 'Tus derechos',
        texto: 'Podés pedirnos en cualquier momento acceder a tus datos, corregirlos o eliminarlos.',
      },
    ],
  },
  arrepentimiento: {
    titulo: 'Botón de arrepentimiento',
    descripcion: '¿Te arrepentiste de tu compra? Tenés 10 días para cancelarla.',
    secciones: [
      {
        titulo: 'Cómo funciona',
        texto: 'Podés revocar tu compra dentro de los 10 días corridos desde que recibiste el producto, sin dar explicaciones y sin costo.',
      },
      {
        titulo: 'Cómo pedirlo',
        texto: 'Escribinos a hola@manadapetshop.com o por WhatsApp con tu número de pedido. El producto debe estar sin uso y en su empaque original.',
      },
      {
        titulo: 'Reintegro',
        texto: 'Te devolvemos el importe por el mismo medio de pago con el que compraste.',
      },
    ],
  },
}

export default function Legal({ documento }) {
  const { titulo, descripcion, secciones } = DOCUMENTOS[documento]

  return (
    <Contenedor>
      <EncabezadoPagina titulo={titulo} descripcion={descripcion} />
      <div className={estilos.texto}>
        {secciones.map(({ titulo: subtitulo, texto }) => (
          <section key={subtitulo}>
            <h2>{subtitulo}</h2>
            <p>{texto}</p>
          </section>
        ))}
      </div>
    </Contenedor>
  )
}
