// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PanelElevador from './PanelElevador'
import { demoraPorPiso, useElevator } from './useElevator'

let contenedor: HTMLDivElement
let raiz: Root
let desmontado: boolean

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  contenedor = document.createElement('div')
  document.body.append(contenedor)
  raiz = createRoot(contenedor)
  desmontado = false
})

afterEach(() => {
  if (!desmontado) act(() => raiz.unmount())
  contenedor.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function elegirPiso(piso: number) {
  const boton = contenedor.querySelector<HTMLButtonElement>(`[aria-label="Ir al piso ${piso}"]`)!
  act(() => boton.click())
}

function avanzarUnPiso() {
  act(() => vi.advanceTimersByTime(demoraPorPiso))
}

function leerPiso() {
  return Number(contenedor.querySelector('[role="status"] strong')?.textContent)
}

function leerHistorial() {
  return Array.from(contenedor.querySelectorAll('ol li'), (viaje) => viaje.textContent)
}

describe('Elevador inteligente', () => {
  it('sube y baja piso por piso y conserva los tres recorridos completos', () => {
    act(() => raiz.render(<StrictMode><PanelElevador /></StrictMode>))
    expect(leerPiso()).toBe(1)
    expect(contenedor.querySelectorAll('button')).toHaveLength(10)

    elegirPiso(5)
    expect(contenedor.querySelector('fieldset')?.disabled).toBe(true)
    expect(leerPiso()).toBe(1)
    avanzarUnPiso()
    expect(leerPiso()).toBe(2)
    expect(leerHistorial()).toEqual([])

    for (const piso of [3, 4, 5]) {
      avanzarUnPiso()
      expect(leerPiso()).toBe(piso)
    }
    expect(contenedor.querySelector('fieldset')?.disabled).toBe(false)

    elegirPiso(9)
    for (const piso of [6, 7, 8, 9]) {
      avanzarUnPiso()
      expect(leerPiso()).toBe(piso)
    }

    elegirPiso(4)
    for (const piso of [8, 7, 6, 5, 4]) {
      avanzarUnPiso()
      expect(leerPiso()).toBe(piso)
    }

    expect(leerHistorial()).toEqual([
      'Petición 1: [1, 2, 3, 4, 5]',
      'Petición 2: [5, 6, 7, 8, 9]',
      'Petición 3: [9, 8, 7, 6, 5, 4]',
    ])
  })

  it('ignora destinos inválidos, el piso actual y solicitudes durante un viaje', () => {
    let elevador: ReturnType<typeof useElevator>
    function ProbarHook() {
      elevador = useElevator()
      return null
    }
    act(() => raiz.render(<ProbarHook />))

    act(() => {
      for (const piso of [0, 11, 2.5, 1]) elevador.solicitarDestino(piso)
    })
    expect(elevador!.pisoDestino).toBeNull()
    expect(elevador!.pisosRecorridos).toEqual([])

    act(() => {
      elevador.solicitarDestino(2)
      elevador.solicitarDestino(10)
    })
    expect(elevador!.pisoDestino).toBe(2)
    avanzarUnPiso()
    expect(elevador!.pisosRecorridos).toEqual([[1, 2]])
  })

  it('cancela el temporizador si el panel se desmonta durante un viaje', () => {
    act(() => raiz.render(<PanelElevador />))
    elegirPiso(10)
    expect(vi.getTimerCount()).toBe(1)

    act(() => raiz.unmount())
    desmontado = true
    expect(vi.getTimerCount()).toBe(0)
  })
})
