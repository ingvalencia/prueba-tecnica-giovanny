import { pisos, useElevator } from './useElevator'

export default function PanelElevador() {
  const { pisoActual, pisoDestino, pisosRecorridos, solicitarDestino } = useElevator()

  return (
    <section aria-labelledby="titulo-elevador">
      <h2 id="titulo-elevador">Elevador inteligente</h2>
      <p role="status">
        Piso actual: <strong>{pisoActual}</strong>
        {pisoDestino !== null && <> · Destino: {pisoDestino}</>}
      </p>

      <fieldset disabled={pisoDestino !== null}>
        <legend>Selecciona un piso</legend>
        {pisos.map((piso) => (
          <button
            key={piso}
            type="button"
            aria-label={`Ir al piso ${piso}`}
            disabled={piso === pisoActual}
            onClick={() => solicitarDestino(piso)}
          >
            {piso}
          </button>
        ))}
      </fieldset>

      <h3>Historial de recorridos</h3>
      {pisosRecorridos.length === 0 ? (
        <p>Aún no hay viajes completados.</p>
      ) : (
        <ol aria-label="Peticiones completadas">
          {pisosRecorridos.map((recorrido, indice) => (
            <li key={indice}>Petición {indice + 1}: [{recorrido.join(', ')}]</li>
          ))}
        </ol>
      )}
    </section>
  )
}
