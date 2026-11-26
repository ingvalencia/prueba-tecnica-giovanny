# API de clientes

Web API en .NET 10 con SQL Server 2022. `SqlConnection` y `SqlCommand` ejecutan los procedimientos almacenados con parámetros.

| Método y ruta | Respuestas |
|---|---|
| `POST /api/cliente` | `201` con el ID y la cabecera `Location`, `400` por datos inválidos o edad menor de 18 y `409` por cuenta o tarjeta repetida. |
| `GET /api/clientes/{id}` | `200` con los datos del cliente y los últimos cuatro dígitos de la tarjeta, o `404` si el ID no existe. |

La tabla guarda una cuenta y una tarjeta por alta. Ambas tienen restricciones únicas. Se guardan como texto para conservar los ceros iniciales. La edad se comprueba con la fecha UTC de SQL Server.

## Preparar SQL Server

Los comandos de esta guía se ejecutan desde la carpeta `api-clientes`, en PowerShell. Se requiere el SDK de .NET 10 y una instancia de SQL Server 2022. Para usar Docker Desktop con el motor Linux, ejecuta:

```powershell
$clave = Read-Host "Contraseña local de sa" -AsSecureString
$env:MSSQL_SA_PASSWORD = [System.Net.NetworkCredential]::new('sa', $clave).Password
try {
    docker run -d --name sql-captacion `
        -e ACCEPT_EULA=Y -e MSSQL_PID=Developer -e MSSQL_SA_PASSWORD `
        -p 127.0.0.1:14333:1433 `
        -v captacion-sql-datos:/var/opt/mssql `
        mcr.microsoft.com/mssql/server:2022-latest
    if ($LASTEXITCODE -ne 0) { throw 'Docker no pudo arrancar SQL Server.' }
} finally {
    Remove-Item Env:MSSQL_SA_PASSWORD -ErrorAction SilentlyContinue
}
```

Usa una contraseña de al menos ocho caracteres con mayúsculas, minúsculas, dígitos y un símbolo. Guarda la misma clave para arrancar la API. Si el contenedor ya existe y está detenido, usa `docker start sql-captacion`.

Cuando `docker logs --tail 20 sql-captacion` indique que SQL Server acepta conexiones, ejecuta los scripts:

```powershell
docker exec sql-captacion mkdir -p /tmp/captacion-sql
if ($LASTEXITCODE -ne 0) { throw 'No se pudo crear la carpeta temporal.' }
docker cp .\sql\. sql-captacion:/tmp/captacion-sql/
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron copiar los scripts.' }

foreach ($archivo in (Get-ChildItem .\sql\*.sql | Sort-Object Name)) {
    docker exec sql-captacion sh -c 'SQLCMDPASSWORD="$MSSQL_SA_PASSWORD" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -f 65001 -i "$1"' sh "/tmp/captacion-sql/$($archivo.Name)"
    if ($LASTEXITCODE -ne 0) { throw "Falló $($archivo.Name)." }
}
```

## Arrancar la API

```powershell
$clave = Read-Host "Contraseña de sa" -AsSecureString
$cadena = New-Object System.Data.Common.DbConnectionStringBuilder
$cadena['Server'] = 'tcp:127.0.0.1,14333'
$cadena['Database'] = 'Captacion'
$cadena['User ID'] = 'sa'
$cadena['Password'] = [System.Net.NetworkCredential]::new('sa', $clave).Password
$cadena['Encrypt'] = 'True'
$cadena['TrustServerCertificate'] = 'True'
$env:ConnectionStrings__Captacion = $cadena.ConnectionString

try {
    dotnet run --project .\ApiClientes --urls http://127.0.0.1:5080
} finally {
    Remove-Item Env:ConnectionStrings__Captacion -ErrorAction SilentlyContinue
    $cadena.Clear()
}
```

Si usas otra instancia, ajusta el servidor y la autenticación en esa sesión. La configuración del certificado en este ejemplo es para el contenedor local.

## Pruebas y evidencias

En otra terminal, desde `api-clientes`, ejecuta las pruebas unitarias:

```powershell
dotnet test .\ApiClientes.slnx -c Release
```

Importa la [colección de Postman](postman/ApiClientes.postman_collection.json) y ejecútala en orden con la API en `http://127.0.0.1:5080`. La primera petición genera datos ficticios y guarda el ID para la consulta. La colección realiza trece comprobaciones en siete solicitudes.

Para enviar dos altas con cuentas distintas y la misma tarjeta:

```powershell
.\pruebas\altas-simultaneas.ps1
```

El resultado esperado es un `201` y un `409` por tarjeta duplicada.

| Evidencia | Resultado |
|---|---|
| [xUnit](evidencias/01-xunit.png) | 5 pruebas aprobadas. |
| [Registro de la API](evidencias/02-api-alta-y-consulta.png) | Alta `201` y consulta `200`. |
| [Alta](evidencias/03-postman-alta.png) y [consulta](evidencias/04-postman-consulta.png) | Mismo ID en las dos respuestas. |
| [Cuenta duplicada](evidencias/05-postman-cuenta-duplicada.png) y [tarjeta duplicada](evidencias/06-postman-tarjeta-duplicada.png) | `409` con mensajes distintos. |
| [Menor de edad](evidencias/07-postman-menor.png) y [cumple 18 años](evidencias/08-postman-cumple-18.png) | `400` y `201`, respectivamente. |
| [Cliente inexistente](evidencias/09-postman-inexistente.png) | `404`. |
