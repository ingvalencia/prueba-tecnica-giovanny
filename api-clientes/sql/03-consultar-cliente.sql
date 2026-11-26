USE Captacion;
GO

CREATE OR ALTER PROCEDURE dbo.ConsultarCliente
    @Id int
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, NombreCompleto, FechaNacimiento, NumeroCuenta,
           RIGHT(NumeroTarjeta, 4) AS UltimosDigitosTarjeta
    FROM dbo.Clientes
    WHERE Id = @Id;
END;
GO
