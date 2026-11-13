using Microsoft.EntityFrameworkCore;
using PlanetarioWeb.Configuration;
using PlanetarioWeb.Data;
using PlanetarioWeb.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Opciones de IA
builder.Services.Configure<AiOptions>(
    builder.Configuration.GetSection(AiOptions.SectionName));

// 2. Registro de HttpClient con Timeout configurado
var timeoutSeconds = builder.Configuration.GetValue<int>("AiService:TimeoutSeconds", 15);
builder.Services.AddHttpClient<IAiService, AiService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(timeoutSeconds);
    client.DefaultRequestHeaders.Add("User-Agent", "PlanetarioWeb-Spacecraft-AI/1.0");
});

// 3. Configuración de Base de Datos SQL Server (Entity Framework Core)
var connectionString = builder.Configuration.GetConnectionString("PlanetarioConnection");
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseSqlServer(connectionString, sqlServerOptions =>
        {
            sqlServerOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
    });
}

// 4. Servicios MVC y Controladores API
builder.Services.AddControllersWithViews();

// 5. Soporte CORS para entorno de desarrollo y pruebas
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 6. Pipeline de Solicitudes HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

// Rutas de controladores MVC y API
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

app.Run();
