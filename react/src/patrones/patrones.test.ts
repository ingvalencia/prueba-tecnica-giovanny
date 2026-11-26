import { describe, expect, it } from 'vitest'
import { obtenerPatron, sonIsomorfas } from './patrones'

describe('Patrones de posiciones', () => {
  it('registra la primera posición de cada letra', () => {
    expect(obtenerPatron('casa')).toEqual([0, 1, 2, 1])
    expect(obtenerPatron('abba')).toEqual([0, 1, 1, 0])
  })

  it('reconoce palabras con el mismo patrón', () => {
    expect(sonIsomorfas('casa', 'toro')).toBe(true)
  })

  it('rechaza palabras con distinta longitud', () => {
    expect(sonIsomorfas('aa', 'bbb')).toBe(false)
  })

  it('rechaza palabras cuya repetición ocurre en posiciones distintas', () => {
    expect(sonIsomorfas('abc', 'xyx')).toBe(false)
  })

  it('distingue las letras latinas y cirílicas del enunciado', () => {
    const primeraPalabra = 'a\u0430bb\u0441cdd\u0441c'
    const segundaPalabra = 'abcd\u0430bcd\u0441c'

    expect(obtenerPatron(primeraPalabra)).toEqual([0, 1, 2, 2, 4, 5, 6, 6, 4, 5])
    expect(obtenerPatron(segundaPalabra)).toEqual([0, 1, 2, 3, 4, 1, 2, 3, 8, 2])
    expect(sonIsomorfas(primeraPalabra, segundaPalabra)).toBe(false)
  })
})
