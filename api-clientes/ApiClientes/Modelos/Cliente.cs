using System.ComponentModel.DataAnnotations;

namespace ApiClientes.Modelos;

public sealed class NuevoCliente
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(120, ErrorMessage = "El nombre admite hasta 120 caracteres.")]
    public string NombreCompleto { get; init; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
    public DateOnly? FechaNacimiento { get; init; }

    [Required(ErrorMessage = "El número de cuenta es obligatorio.")]
    [StringLength(30, ErrorMessage = "La cuenta admite hasta 30 dígitos.")]
    [RegularExpression("[0-9]+", ErrorMessage = "La cuenta solo admite dígitos.")]
    public string NumeroCuenta { get; init; } = string.Empty;

    [Required(ErrorMessage = "El número de tarjeta es obligatorio.")]
    [StringLength(19, ErrorMessage = "La tarjeta admite hasta 19 dígitos.")]
    [RegularExpression("[0-9]+", ErrorMessage = "La tarjeta solo admite dígitos.")]
    public string NumeroTarjeta { get; init; } = string.Empty;
}

public sealed record Cliente(
    int Id,
    string NombreCompleto,
    DateOnly FechaNacimiento,
    string NumeroCuenta,
    string UltimosDigitosTarjeta);
