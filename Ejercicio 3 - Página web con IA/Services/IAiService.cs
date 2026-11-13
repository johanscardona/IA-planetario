using PlanetarioWeb.DTOs;

namespace PlanetarioWeb.Services;

public interface IAiService
{
    /// <summary>
    /// Procesa la consulta del explorador con el contexto del astro seleccionado
    /// utilizando el System Prompt blindado de la computadora de a bordo.
    /// </summary>
    Task<AiResponse> AskOnBoardComputerAsync(AiRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Valida si el astro consultado pertenece al catálogo oficial de la nave.
    /// </summary>
    bool IsAllowedAstro(string astroName);

    /// <summary>
    /// Determina la categoría astronómica del objeto.
    /// </summary>
    string GetAstroCategory(string astroName);
}
