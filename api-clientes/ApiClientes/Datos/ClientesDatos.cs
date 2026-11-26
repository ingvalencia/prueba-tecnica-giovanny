using System.Data;
using ApiClientes.Modelos;
using Microsoft.Data.SqlClient;

namespace ApiClientes.Datos;

public sealed class ClientesDatos(string cadena)
{
    public async Task<int> InsertarAsync(NuevoCliente cliente, CancellationToken cancelacion)
    {
        await using var conexion = new SqlConnection(cadena);
        await using var comando = new SqlCommand("dbo.InsertarCliente", conexion);
        comando.CommandType = CommandType.StoredProcedure;
        comando.Parameters.Add("@NombreCompleto", SqlDbType.NVarChar, 120).Value = cliente.NombreCompleto.Trim();
        comando.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value =
            (object?)cliente.FechaNacimiento ?? DBNull.Value;
        comando.Parameters.Add("@NumeroCuenta", SqlDbType.VarChar, 30).Value = cliente.NumeroCuenta;
        comando.Parameters.Add("@NumeroTarjeta", SqlDbType.VarChar, 19).Value = cliente.NumeroTarjeta;

        await conexion.OpenAsync(cancelacion);
        var resultado = await comando.ExecuteScalarAsync(cancelacion);
        return resultado is int id
            ? id
            : throw new InvalidOperationException("El procedimiento de alta no devolvió un ID.");
    }

    public async Task<Cliente?> ConsultarAsync(int id, CancellationToken cancelacion)
    {
        await using var conexion = new SqlConnection(cadena);
        await using var comando = new SqlCommand("dbo.ConsultarCliente", conexion);
        comando.CommandType = CommandType.StoredProcedure;
        comando.Parameters.Add("@Id", SqlDbType.Int).Value = id;

        await conexion.OpenAsync(cancelacion);
        await using var lector = await comando.ExecuteReaderAsync(CommandBehavior.SingleRow, cancelacion);
        if (!await lector.ReadAsync(cancelacion))
            return null;

        return new Cliente(
            lector.GetInt32(lector.GetOrdinal("Id")),
            lector.GetString(lector.GetOrdinal("NombreCompleto")),
            DateOnly.FromDateTime(lector.GetDateTime(lector.GetOrdinal("FechaNacimiento"))),
            lector.GetString(lector.GetOrdinal("NumeroCuenta")),
            lector.GetString(lector.GetOrdinal("UltimosDigitosTarjeta")));
    }
}
