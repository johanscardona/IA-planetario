namespace PlanetarioWeb.Configuration;

/// <summary>
/// Opciones de configuración para el servicio de Inteligencia Artificial.
/// </summary>
public class AiOptions
{
    public const string SectionName = "AiService";

    /// <summary>
    /// Proveedor de IA seleccionado: "OpenAI" o "Gemini".
    /// </summary>
    public string Provider { get; set; } = "Gemini";

    /// <summary>
    /// Clave de API para el proveedor seleccionado.
    /// Puede obtenerse de variables de entorno (GEMINI_API_KEY o OPENAI_API_KEY).
    /// </summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Nombre del modelo (ej. "gemini-2.5-flash", "gemini-1.5-pro", "gpt-4o-mini").
    /// </summary>
    public string Model { get; set; } = "gemini-2.5-flash";

    /// <summary>
    /// Endpoint personalizado en caso de ser necesario.
    /// </summary>
    public string? Endpoint { get; set; }

    /// <summary>
    /// Tiempo límite en segundos para la llamada HTTP.
    /// </summary>
    public int TimeoutSeconds { get; set; } = 15;
}
