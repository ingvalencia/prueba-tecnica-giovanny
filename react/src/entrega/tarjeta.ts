import { create } from 'zustand'

type TipoTarjeta = 'CREDITO' | 'DEBITO'

interface TarjetaSeleccionada {
  productoId: string
  tipo: TipoTarjeta
  limiteOtorgado: number
  ultimosDigitos: string
}

interface EstadoTarjeta {
  tarjetaSeleccionada: TarjetaSeleccionada
  seleccionarTarjeta: (tarjetaSeleccionada: TarjetaSeleccionada) => void
}

export const useTarjeta = create<EstadoTarjeta>()((set) => ({
  tarjetaSeleccionada: {
    productoId: 'PROD_TDC_PLATINUM',
    tipo: 'CREDITO',
    limiteOtorgado: 85000,
    ultimosDigitos: '4421',
  },
  seleccionarTarjeta: (tarjetaSeleccionada) => set({ tarjetaSeleccionada }),
}))
