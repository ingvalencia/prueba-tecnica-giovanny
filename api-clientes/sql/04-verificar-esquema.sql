USE Captacion;
GO

IF OBJECT_ID(N'dbo.Clientes', N'U') IS NULL
    THROW 50100, N'Falta la tabla Clientes.', 1;

IF OBJECT_ID(N'dbo.InsertarCliente', N'P') IS NULL
   OR OBJECT_ID(N'dbo.ConsultarCliente', N'P') IS NULL
    THROW 50101, N'Falta un procedimiento de clientes.', 1;

SELECT DB_NAME() AS BaseDeDatos,
       OBJECT_NAME(OBJECT_ID(N'dbo.Clientes')) AS Tabla,
       OBJECT_NAME(OBJECT_ID(N'dbo.InsertarCliente')) AS ProcedimientoAlta,
       OBJECT_NAME(OBJECT_ID(N'dbo.ConsultarCliente')) AS ProcedimientoConsulta;

SELECT name AS Restriccion
FROM sys.key_constraints
WHERE parent_object_id = OBJECT_ID(N'dbo.Clientes') AND type = 'UQ'
ORDER BY name;
GO
