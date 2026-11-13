using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanetarioWeb.Models;

/// <summary>
/// Registra las interacciones de exploración y preguntas respondidas por la IA de a bordo.
/// </summary>
[Table("HistorialObservaciones")]
public class HistorialObservacion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdObservacion { get; set; }

    public int? IdUsuario { get; set; }

    [Required]
    [MaxLength(50)]
    public string CategoriaAstronomica { get; set; } = "Sistema Solar";

    [Required]
    [MaxLength(100)]
    public string NombreAstro { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string PreguntaRealizada { get; set; } = string.Empty;

    [Required]
    [MaxLength(1500)]
    public string RespuestaIA { get; set; } = string.Empty;

    public DateTime FechaObservacion { get; set; } = DateTime.UtcNow;

    // Propiedad de navegación
    [ForeignKey(nameof(IdUsuario))]
    public virtual Usuario? Usuario { get; set; }
}
