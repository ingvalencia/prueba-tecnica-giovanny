IF DB_ID(N'Captacion') IS NULL
    CREATE DATABASE Captacion;
GO

USE Captacion;
GO

IF OBJECT_ID(N'dbo.Clientes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clientes (
        Id int IDENTITY(1, 1) NOT NULL CONSTRAINT PK_Clientes PRIMARY KEY,
        NombreCompleto nvarchar(120) NOT NULL,
        FechaNacimiento date NOT NULL,
        NumeroCuenta varchar(30) NOT NULL,
        NumeroTarjeta varchar(19) NOT NULL,
        CONSTRAINT UQ_Clientes_NumeroCuenta UNIQUE (NumeroCuenta),
        CONSTRAINT UQ_Clientes_NumeroTarjeta UNIQUE (NumeroTarjeta)
    );
END;
GO
