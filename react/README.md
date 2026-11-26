# Ejercicio práctico React

Proyecto de React con Vite y TypeScript.

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
