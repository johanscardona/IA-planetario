using System.ComponentModel.DataAnnotations;

namespace PlanetarioWeb.DTOs;

/// <summary>
/// DTO recibido desde el Frontend con la consulta del explorador sobre un astro.
/// </summary>
public class AiRequest
{
    [Required(ErrorMessage = "El nombre del astro es obligatorio.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre del astro debe tener entre 2 y 100 caracteres.")]
    public string AstroName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La pregunta es obligatoria.")]
    [StringLength(500, MinimumLength = 2, ErrorMessage = "La pregunta debe tener entre 2 y 500 caracteres.")]
    public string Question { get; set; } = string.Empty;

    /// <summary>
    /// ID opcional del explorador si la sesión está autenticada.
    /// </summary>
    public int? UserId { get; set; }
}
