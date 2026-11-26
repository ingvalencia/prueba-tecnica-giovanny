import { create } from 'zustand'

interface DomicilioEntrega {
  calle: string
  codigoPostal: string
  referencias: string | null
  estatusValidacionCP: boolean
}

interface EstadoDomicilio {
  domicilioEntrega: DomicilioEntrega
  actualizarCodigoPostal: (codigoPostal: string) => void
  validarFormatoCodigoPostal: () => void
}

export const useDomicilio = create<EstadoDomicilio>()((set) => ({
  domicilioEntrega: {
    calle: 'Av. Insurgentes Sur 1400',
    codigoPostal: '03100',
    referencias: null,
    estatusValidacionCP: false,
  },
  actualizarCodigoPostal: (codigoPostal) => set(({ domicilioEntrega }) => ({
    domicilioEntrega: { ...domicilioEntrega, codigoPostal, estatusValidacionCP: false },
  })),
  validarFormatoCodigoPostal: () => set(({ domicilioEntrega }) => ({
    domicilioEntrega: {
      ...domicilioEntrega,
      estatusValidacionCP: /^\d{5}$/.test(domicilioEntrega.codigoPostal),
    },
  })),
}))
