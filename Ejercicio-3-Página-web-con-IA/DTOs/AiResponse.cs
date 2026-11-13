namespace PlanetarioWeb.DTOs;

/// <summary>
/// DTO devuelto al Frontend con la respuesta de la computadora de a bordo.
/// </summary>
public class AiResponse
{
    public string AstroName { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public bool Success { get; set; } = true;
    public string? ErrorMessage { get; set; }
}
