import { create } from 'zustand'

interface ClienteSolicitante {
  id: string
  nombreCompleto: string
  rfc: string
  scoreVerificado: boolean | null
}

interface EstadoCliente {
  clienteSolicitante: ClienteSolicitante
  actualizarScoreVerificado: (scoreVerificado: ClienteSolicitante['scoreVerificado']) => void
}

export const useCliente = create<EstadoCliente>()((set) => ({
  clienteSolicitante: {
    id: 'CLI-554433',
    nombreCompleto: 'María López',
    rfc: 'LORM901215ABC',
    scoreVerificado: null,
  },
  actualizarScoreVerificado: (scoreVerificado) => set(({ clienteSolicitante }) => ({
    clienteSolicitante: { ...clienteSolicitante, scoreVerificado },
  })),
}))
