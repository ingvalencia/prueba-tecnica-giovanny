using System.ComponentModel.DataAnnotations;
using ApiClientes.Modelos;

namespace ApiClientes.Pruebas;

public class NuevoClientePruebas
{
    [Fact]
    public void AceptaDatosValidosYConservaCerosIniciales()
    {
        var cliente = CrearCliente();

        Assert.Empty(Validar(cliente));
        Assert.StartsWith("00", cliente.NumeroCuenta);
        Assert.StartsWith("00", cliente.NumeroTarjeta);
    }

    [Fact]
    public void ExigeLosCuatroCampos()
    {
        var cliente = new NuevoCliente();
        var campos = Validar(cliente).SelectMany(error => error.MemberNames).ToArray();

        Assert.Equal(4, campos.Length);
        Assert.Contains(nameof(NuevoCliente.NombreCompleto), campos);
        Assert.Contains(nameof(NuevoCliente.FechaNacimiento), campos);
        Assert.Contains(nameof(NuevoCliente.NumeroCuenta), campos);
        Assert.Contains(nameof(NuevoCliente.NumeroTarjeta), campos);
    }

    [Theory]
    [InlineData("00A123", "0001234567890123", nameof(NuevoCliente.NumeroCuenta))]
    [InlineData("000123", "0001234-567890123", nameof(NuevoCliente.NumeroTarjeta))]
    public void CuentaYTarjetaSoloAdmitenDigitos(string cuenta, string tarjeta, string campo)
    {
        Assert.Contains(Validar(CrearCliente(cuenta: cuenta, tarjeta: tarjeta)),
            error => error.MemberNames.Contains(campo));
    }

    [Fact]
    public void RespetaLasLongitudesDeLaBase()
    {
        Assert.Empty(Validar(CrearCliente(new string('A', 120), new string('1', 30), new string('2', 19))));

        var errores = Validar(CrearCliente(new string('A', 121), new string('1', 31), new string('2', 20)));
        Assert.Equal(3, errores.Count);
    }

    private static NuevoCliente CrearCliente(
        string nombre = "Maria Lopez",
        string cuenta = "000123456789",
        string tarjeta = "0001234567890123") => new()
    {
        NombreCompleto = nombre,
        FechaNacimiento = new DateOnly(1990, 12, 15),
        NumeroCuenta = cuenta,
        NumeroTarjeta = tarjeta,
    };

    private static List<ValidationResult> Validar(NuevoCliente cliente)
    {
        var errores = new List<ValidationResult>();
        Validator.TryValidateObject(cliente, new ValidationContext(cliente), errores, validateAllProperties: true);
        return errores;
    }
}
