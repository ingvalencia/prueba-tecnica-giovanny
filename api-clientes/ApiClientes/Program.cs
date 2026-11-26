using ApiClientes.Datos;

var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddControllers();

var cadena = constructor.Configuration.GetConnectionString("Captacion");
if (string.IsNullOrWhiteSpace(cadena))
    throw new InvalidOperationException("Configura ConnectionStrings:Captacion.");

constructor.Services.AddScoped(_ => new ClientesDatos(cadena));

var aplicacion = constructor.Build();
aplicacion.MapControllers();
aplicacion.Run();
