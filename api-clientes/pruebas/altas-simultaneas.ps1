param([string]$UrlApi = 'http://127.0.0.1:5080')

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Net.Http

$sufijo = [DateTime]::UtcNow.ToString('yyyyMMddHHmmssfff')
$tarjeta = "91$sufijo"
$urlAlta = $UrlApi.TrimEnd('/') + '/api/cliente'
$clienteHttp = [System.Net.Http.HttpClient]::new()
$clienteHttp.Timeout = [TimeSpan]::FromSeconds(30)
$solicitudes = @()

try {
    foreach ($prefijo in @('81', '82')) {
        $cuenta = "$prefijo$sufijo"
        $json = @{
            nombreCompleto = 'Cliente de prueba'
            fechaNacimiento = '1990-12-15'
            numeroCuenta = $cuenta
            numeroTarjeta = $tarjeta
        } | ConvertTo-Json -Compress

        $contenido = [System.Net.Http.StringContent]::new($json, [Text.Encoding]::UTF8, 'application/json')
        $solicitudes += [pscustomobject]@{
            Cuenta = $cuenta
            Contenido = $contenido
            Tarea = $clienteHttp.PostAsync($urlAlta, $contenido)
        }
    }

    $resultados = foreach ($solicitud in $solicitudes) {
        $respuesta = $solicitud.Tarea.GetAwaiter().GetResult()
        try {
            [pscustomobject]@{
                Cuenta = $solicitud.Cuenta
                Estado = [int]$respuesta.StatusCode
                Respuesta = $respuesta.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            }
        } finally {
            $respuesta.Dispose()
        }
    }

    $resultados | Format-Table -AutoSize | Out-Host
    $estados = ($resultados.Estado | Sort-Object) -join ','
    $conflicto = $resultados | Where-Object { $_.Estado -eq 409 }
    if ($estados -ne '201,409' -or $conflicto.Respuesta -notmatch 'tarjeta') {
        throw 'Se esperaba un alta 201 y un conflicto 409 por tarjeta duplicada.'
    }

    Write-Host 'Prueba aprobada: una sola cuenta quedo asociada a la tarjeta.'
} finally {
    $clienteHttp.Dispose()
    foreach ($solicitud in $solicitudes) {
        $solicitud.Contenido.Dispose()
    }
}
