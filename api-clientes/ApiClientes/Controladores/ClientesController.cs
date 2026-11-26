using ApiClientes.Datos;
using ApiClientes.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace ApiClientes.Controladores;

[ApiController]
public sealed class ClientesController(ClientesDatos datos) : ControllerBase
{
    [HttpGet("api/clientes/{id:int}")]
    public async Task<ActionResult<Cliente>> Consultar(int id, CancellationToken cancelacion)
    {
        var cliente = await datos.ConsultarAsync(id, cancelacion);
        if (cliente is null)
            return NotFound(new { mensaje = "Cliente no encontrado." });

        return Ok(cliente);
    }

    [HttpPost("api/cliente")]
    public async Task<IActionResult> Insertar(NuevoCliente cliente, CancellationToken cancelacion)
    {
        try
        {
            var id = await datos.InsertarAsync(cliente, cancelacion);
            return CreatedAtAction(nameof(Consultar), new { id }, new { id });
        }
        catch (SqlException error) when (error.Number is 50001 or 50004)
        {
            return BadRequest(new { mensaje = error.Message });
        }
        catch (SqlException error) when (error.Number is 50002 or 50003)
        {
            return Conflict(new { mensaje = error.Message });
        }
    }
}
