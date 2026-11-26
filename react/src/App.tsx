import EntregaTarjeta from './entrega/EntregaTarjeta'
import PanelElevador from './elevador/PanelElevador'
import { obtenerPatron, sonIsomorfas } from './patrones/patrones'

// Uso escapes para conservar las letras del enunciado.
const primeraPalabra = 'a\u0430bb\u0441cdd\u0441c'
const segundaPalabra = 'abcd\u0430bcd\u0441c'

export default function App() {
  const primerPatron = obtenerPatron(primeraPalabra)
  const segundoPatron = obtenerPatron(segundaPalabra)
  const mismoPatron = sonIsomorfas(primeraPalabra, segundaPalabra)

  return (
    <main>
      <h1>Ejercicio práctico React</h1>

      <section aria-labelledby="titulo-patrones">
        <h2 id="titulo-patrones">Patrones de posiciones</h2>
        <dl>
          <dt>Palabra 1: <code>{primeraPalabra}</code></dt>
          <dd><code>[{primerPatron.join(', ')}]</code></dd>

          <dt>Palabra 2: <code>{segundaPalabra}</code></dt>
          <dd><code>[{segundoPatron.join(', ')}]</code></dd>
        </dl>
        <p>¿Comparten el mismo patrón? <strong>{String(mismoPatron)}</strong></p>
      </section>
      <EntregaTarjeta />
      <PanelElevador />
    </main>
  )
}
