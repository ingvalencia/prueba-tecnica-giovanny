USE Captacion;
GO

CREATE OR ALTER PROCEDURE dbo.InsertarCliente
    @NombreCompleto nvarchar(120),
    @FechaNacimiento date,
    @NumeroCuenta varchar(30),
    @NumeroTarjeta varchar(19)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @Hoy date = CONVERT(date, SYSUTCDATETIME());
    DECLARE @Id int;

    IF @FechaNacimiento IS NULL
        THROW 50004, N'La fecha de nacimiento es obligatoria.', 1;

    IF @FechaNacimiento > DATEADD(year, -18, @Hoy)
        THROW 50001, N'El cliente debe tener al menos 18 años cumplidos.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Los bloqueos se conservan hasta terminar el alta.
        IF EXISTS (
            SELECT 1 FROM dbo.Clientes WITH (UPDLOCK, HOLDLOCK, INDEX(UQ_Clientes_NumeroTarjeta))
            WHERE NumeroTarjeta = @NumeroTarjeta
        )
            THROW 50002, N'La tarjeta ya está asociada a una cuenta.', 1;

        IF EXISTS (
            SELECT 1 FROM dbo.Clientes WITH (UPDLOCK, HOLDLOCK, INDEX(UQ_Clientes_NumeroCuenta))
            WHERE NumeroCuenta = @NumeroCuenta
        )
            THROW 50003, N'El número de cuenta ya está registrado.', 1;

        INSERT INTO dbo.Clientes (NombreCompleto, FechaNacimiento, NumeroCuenta, NumeroTarjeta)
        VALUES (@NombreCompleto, @FechaNacimiento, @NumeroCuenta, @NumeroTarjeta);

        SET @Id = CONVERT(int, SCOPE_IDENTITY());
        COMMIT TRANSACTION;

        SELECT @Id AS Id;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
