import { afterEach, describe, expect, it } from 'vitest'
import { useCliente } from './cliente'
import { useDomicilio } from './domicilio'
import { useTarjeta } from './tarjeta'

afterEach(() => {
  useCliente.setState(useCliente.getInitialState(), true)
  useDomicilio.setState(useDomicilio.getInitialState(), true)
  useTarjeta.setState(useTarjeta.getInitialState(), true)
})

describe('Stores de entrega', () => {
  it('actualiza el score sin cambiar tarjeta ni domicilio', () => {
    const tarjeta = useTarjeta.getState()
    const domicilio = useDomicilio.getState()

    useCliente.getState().actualizarScoreVerificado(true)

    expect(useCliente.getState().clienteSolicitante.scoreVerificado).toBe(true)
    expect(useTarjeta.getState()).toBe(tarjeta)
    expect(useDomicilio.getState()).toBe(domicilio)
  })

  it('selecciona otra tarjeta sin cambiar cliente ni domicilio', () => {
    const cliente = useCliente.getState()
    const domicilio = useDomicilio.getState()
    const tarjeta = { ...useTarjeta.getState().tarjetaSeleccionada, ultimosDigitos: '0087' }

    useTarjeta.getState().seleccionarTarjeta(tarjeta)

    expect(useTarjeta.getState().tarjetaSeleccionada).toEqual(tarjeta)
    expect(useCliente.getState()).toBe(cliente)
    expect(useDomicilio.getState()).toBe(domicilio)
  })

  it('valida cinco dígitos y conserva el cero inicial', () => {
    const cliente = useCliente.getState()
    const tarjeta = useTarjeta.getState()

    useDomicilio.getState().validarFormatoCodigoPostal()

    expect(useDomicilio.getState().domicilioEntrega.codigoPostal).toBe('03100')
    expect(useDomicilio.getState().domicilioEntrega.estatusValidacionCP).toBe(true)
    expect(useCliente.getState()).toBe(cliente)
    expect(useTarjeta.getState()).toBe(tarjeta)
  })

  it('reinicia la validación al editar y rechaza formatos incorrectos', () => {
    useDomicilio.getState().validarFormatoCodigoPostal()
    useDomicilio.getState().actualizarCodigoPostal('1234')
    expect(useDomicilio.getState().domicilioEntrega.estatusValidacionCP).toBe(false)

    useDomicilio.getState().validarFormatoCodigoPostal()
    expect(useDomicilio.getState().domicilioEntrega.estatusValidacionCP).toBe(false)

    useDomicilio.getState().actualizarCodigoPostal('03A00')
    useDomicilio.getState().validarFormatoCodigoPostal()
    expect(useDomicilio.getState().domicilioEntrega.estatusValidacionCP).toBe(false)
  })
})
