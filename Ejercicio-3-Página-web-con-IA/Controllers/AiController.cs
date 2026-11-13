using Microsoft.AspNetCore.Mvc;
using PlanetarioWeb.Data;
using PlanetarioWeb.DTOs;
using PlanetarioWeb.Models;
using PlanetarioWeb.Services;

namespace PlanetarioWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;
    private readonly ApplicationDbContext? _dbContext;
    private readonly ILogger<AiController> _logger;

    public AiController(
        IAiService aiService,
        ILogger<AiController> logger,
        ApplicationDbContext? dbContext = null)
    {
        _aiService = aiService;
        _logger = logger;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Consulta contextual a la Computadora de a Bordo sobre el astro actualmente seleccionado.
    /// Ruta: POST /api/ai/ask
    /// </summary>
    [HttpGet("ask")]
    [HttpPost("ask")]
    [ProducesResponseType(typeof(AiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Ask([FromBody] AiRequest? request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            request = new AiRequest
            {
                AstroName = Request.Query["astroName"].FirstOrDefault() ?? string.Empty,
                Question = Request.Query["question"].FirstOrDefault() ?? string.Empty,
                UserId = int.TryParse(Request.Query["userId"].FirstOrDefault(), out var userId) ? userId : null
            };
        }

        // 1. Validación de Modelo
        if (!TryValidateModel(request))
        {
            var errors = string.Join("; ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));
            _logger.LogWarning("Petición rechazada por validación de modelo: {Errors}", errors);
            return BadRequest(new AiResponse
            {
                Success = false,
                ErrorMessage = $"Datos de telemetría inválidos: {errors}"
            });
        }

        // 2. Validación de Astro Permitido (Whitelist)
        if (!_aiService.IsAllowedAstro(request.AstroName))
        {
            _logger.LogWarning("Intento de consulta sobre objeto astronómico no autorizado: {Astro}", request.AstroName);
            return BadRequest(new AiResponse
            {
                Success = false,
                ErrorMessage = $"El objeto astronómico '{request.AstroName}' no forma parte del catálogo de vuelo de esta misión."
            });
        }

        // 3. Procesamiento con la Computadora de a Bordo
        try
        {
            var response = await _aiService.AskOnBoardComputerAsync(request, cancellationToken);

            // 4. Registro opcional en Base de Datos (SQL Server) si está disponible
            if (_dbContext != null)
            {
                try
                {
                    var observacion = new HistorialObservacion
                    {
                        IdUsuario = request.UserId,
                        CategoriaAstronomica = response.Category,
                        NombreAstro = response.AstroName,
                        PreguntaRealizada = request.Question.Trim(),
                        RespuestaIA = response.Answer.Trim(),
                        FechaObservacion = DateTime.UtcNow
                    };

                    _dbContext.HistorialObservaciones.Add(observacion);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Observación guardada exitosamente en el historial para {Astro}.", response.AstroName);
                }
                catch (Exception dbEx)
                {
                    // La persistencia no debe bloquear la experiencia en vivo del explorador si SQL Server no está iniciado
                    _logger.LogWarning(dbEx, "No se pudo persistir la observación en SQL Server. Continuando en modo de vuelo directo.");
                }
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado al procesar consulta de IA para {Astro}.", request.AstroName);
            return StatusCode(StatusCodes.Status500InternalServerError, new AiResponse
            {
                Success = false,
                ErrorMessage = "Fallo en los procesadores cuánticos de la computadora de a bordo. Intente restablecer la comunicación."
            });
        }
    }
}
