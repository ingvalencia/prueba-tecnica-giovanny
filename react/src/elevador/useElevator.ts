import { useEffect, useState } from 'react'

export const pisos = Array.from({ length: 10 }, (_, indice) => indice + 1)
export const demoraPorPiso = 400

interface EstadoElevador {
  pisoActual: number
  pisoDestino: number | null
  recorridoActual: number[]
  pisosRecorridos: number[][]
}

export function useElevator() {
  const [estado, cambiarEstado] = useState<EstadoElevador>({
    pisoActual: 1,
    pisoDestino: null,
    recorridoActual: [],
    pisosRecorridos: [],
  })
  const { pisoActual, pisoDestino, pisosRecorridos } = estado

  useEffect(() => {
    if (pisoDestino === null) return

    const temporizador = setTimeout(() => {
      cambiarEstado((anterior) => {
        const siguientePiso = anterior.pisoActual + Math.sign(pisoDestino - anterior.pisoActual)
        const recorrido = [...anterior.recorridoActual, siguientePiso]

        if (siguientePiso === pisoDestino) {
          return {
            pisoActual: siguientePiso,
            pisoDestino: null,
            recorridoActual: [],
            pisosRecorridos: [...anterior.pisosRecorridos, recorrido],
          }
        }

        return { ...anterior, pisoActual: siguientePiso, recorridoActual: recorrido }
      })
    }, demoraPorPiso)

    return () => clearTimeout(temporizador)
  }, [pisoActual, pisoDestino])

  function solicitarDestino(pisoDestino: number) {
    if (!pisos.includes(pisoDestino)) return

    cambiarEstado((anterior) => {
      if (anterior.pisoDestino !== null || anterior.pisoActual === pisoDestino) return anterior

      return {
        ...anterior,
        pisoDestino,
        recorridoActual: [anterior.pisoActual],
      }
    })
  }

  return { pisoActual, pisoDestino, pisosRecorridos, solicitarDestino }
}
