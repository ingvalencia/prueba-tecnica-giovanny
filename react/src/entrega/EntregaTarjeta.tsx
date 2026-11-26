import { useDomicilio } from './domicilio'

export default function EntregaTarjeta() {
  const { calle, codigoPostal, estatusValidacionCP } = useDomicilio((estado) => estado.domicilioEntrega)
  const actualizarCodigoPostal = useDomicilio((estado) => estado.actualizarCodigoPostal)
  const validarFormatoCodigoPostal = useDomicilio((estado) => estado.validarFormatoCodigoPostal)

  return (
    <section aria-labelledby="titulo-entrega">
      <h2 id="titulo-entrega">Domicilio de entrega</h2>
      <p>{calle}</p>
      <form onSubmit={(evento) => {
        evento.preventDefault()
        validarFormatoCodigoPostal()
      }}>
        <label>
          Código postal{' '}
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            size={6}
            value={codigoPostal}
            onChange={(evento) => actualizarCodigoPostal(evento.target.value)}
          />
        </label>{' '}
        <button type="submit">Validar formato</button>
      </form>
      <p role="status">
        {estatusValidacionCP ? 'Formato válido' : 'El código postal debe tener 5 dígitos para validarse'}
      </p>
    </section>
  )
}
