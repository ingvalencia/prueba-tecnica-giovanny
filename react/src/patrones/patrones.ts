export function obtenerPatron(palabra: string): number[] {
  const posiciones = new Map<string, number>()

  return Array.from(palabra, (letra, indice) => {
    const primeraPosicion = posiciones.get(letra)
    if (primeraPosicion !== undefined) return primeraPosicion

    posiciones.set(letra, indice)
    return indice
  })
}

export function sonIsomorfas(primeraPalabra: string, segundaPalabra: string): boolean {
  const primerPatron = obtenerPatron(primeraPalabra)
  const segundoPatron = obtenerPatron(segundaPalabra)

  return primerPatron.length === segundoPatron.length
    && primerPatron.every((posicion, indice) => posicion === segundoPatron[indice])
}
