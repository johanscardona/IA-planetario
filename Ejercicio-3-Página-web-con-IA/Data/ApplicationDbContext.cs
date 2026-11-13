using Microsoft.EntityFrameworkCore;
using PlanetarioWeb.Models;

namespace PlanetarioWeb.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<HistorialObservacion> HistorialObservaciones => Set<HistorialObservacion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);
            entity.HasIndex(e => e.CorreoElectronico).IsUnique();
            entity.Property(e => e.FechaRegistro).HasDefaultValueSql("SYSUTCDATETIME()");
            entity.Property(e => e.Estado).HasDefaultValue(true);
        });

        // Configuración de HistorialObservacion
        modelBuilder.Entity<HistorialObservacion>(entity =>
        {
            entity.HasKey(e => e.IdObservacion);
            entity.Property(e => e.FechaObservacion).HasDefaultValueSql("SYSUTCDATETIME()");

            entity.HasIndex(e => new { e.IdUsuario, e.FechaObservacion });
            entity.HasIndex(e => new { e.NombreAstro, e.CategoriaAstronomica });

            entity.HasOne(e => e.Usuario)
                  .WithMany(u => u.Observaciones)
                  .HasForeignKey(e => e.IdUsuario)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
