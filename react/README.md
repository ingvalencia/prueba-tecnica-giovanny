# Ejercicio práctico React

Proyecto de React con Vite y TypeScript. Verificado con Node.js `v22.12.0`.

## Ejecutar en PowerShell

Desde la carpeta `react`, instala las dependencias y arranca Vite.

```powershell
npm ci
npm run dev
```

Abre la dirección local que aparezca en la terminal.

## Verificar el proyecto

```powershell
npm test
npm run lint
npm run build
```

`src/main.tsx` monta la aplicación y `src/App.tsx` contiene la pantalla principal.

## Patrones de posiciones

Cada letra toma el índice de la primera vez que aparece. Las palabras del
ejercicio contienen letras latinas y cirílicas que se ven iguales, pero son
caracteres distintos. Sus patrones dan `false` al compararlos.

## Estados monolíticos

Hay un store de Zustand para cada dominio: cliente solicitante, tarjeta
seleccionada y domicilio de entrega. Cada store tiene sus propios tipos y
acciones. El ejemplo en pantalla usa el store de domicilio.

`scoreVerificado` empieza en `null` mientras está pendiente. El código postal
se guarda como texto para conservar ceros iniciales. El botón valida el
formato de cinco dígitos y editar el campo deja la validación pendiente.

## Elevador inteligente

El elevador arranca en el piso 1. Elige un destino del 1 al 10 y espera a
que termine el viaje para elegir otro. El historial agrega una petición por
viaje completo, con el piso de salida y el de llegada incluidos.

`useElevator` programa un salto cada 400 ms con `useEffect` y cancela el
temporizador al desmontarse. Para reproducir el ejemplo, elige 5, 9 y 4.

## Evidencias

- [Patrones de posiciones](evidencias/01-patrones.png). Las palabras del enunciado devuelven `false`.
- [Domicilio antes de validar](evidencias/02-domicilio-pendiente.png) y [después de validar](evidencias/03-domicilio-validado.png). El código postal `03100` conserva el cero inicial.
- [Elevador en movimiento](evidencias/04-elevador-en-movimiento.png) e [historial completo](evidencias/05-elevador-historial.png). El recorrido se reproduce al elegir 5, 9 y 4.
