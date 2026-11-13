using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanetarioWeb.Models;

/// <summary>
/// Representa a un explorador o usuario registrado en la plataforma espacial.
/// </summary>
[Table("Usuarios")]
public class Usuario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdUsuario { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string CorreoElectronico { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

    public bool Estado { get; set; } = true;

    // Relación 1:N con HistorialObservaciones
    public virtual ICollection<HistorialObservacion> Observaciones { get; set; } = new List<HistorialObservacion>();
}
