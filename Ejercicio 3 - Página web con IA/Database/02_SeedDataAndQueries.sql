-- ============================================================================
-- PROYECTO ASTRONOMÍA 3D - PLATAFORMA DE EXPLORACIÓN ESPACIAL CON IA
-- SCRIPT DML: DATOS SEMILLA (SEED DATA) Y CONSULTAS ANALÍTICAS
-- ============================================================================

USE PlanetarioDB;
GO

-- 1. Inserción de Usuarios de Prueba
-- Las contraseñas representan hashes criptográficos simulados (SHA-256)
IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE CorreoElectronico = N'explorador.alfa@mision-espacial.org')
BEGIN
    INSERT INTO dbo.Usuarios (Nombre, CorreoElectronico, PasswordHash, FechaRegistro, Estado)
    VALUES 
    (N'Cmdte. Elena Ruiz', N'explorador.alfa@mision-espacial.org', N'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', SYSUTCDATETIME(), 1),
    (N'Dr. Mateo Navarro', N'mateo.navarro@observatorio.edu', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', SYSUTCDATETIME(), 1),
    (N'Cadete Lucas Silva', N'lucas.silva@academia-aero.com', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', SYSUTCDATETIME(), 1);
    
    PRINT '>> Usuarios de prueba insertados.';
END
GO

-- 2. Inserción de Registros de Observación de Prueba
DECLARE @IdElena INT = (SELECT TOP 1 IdUsuario FROM dbo.Usuarios WHERE CorreoElectronico = N'explorador.alfa@mision-espacial.org');
DECLARE @IdMateo INT = (SELECT TOP 1 IdUsuario FROM dbo.Usuarios WHERE CorreoElectronico = N'mateo.navarro@observatorio.edu');
DECLARE @IdLucas INT = (SELECT TOP 1 IdUsuario FROM dbo.Usuarios WHERE CorreoElectronico = N'lucas.silva@academia-aero.com');

IF NOT EXISTS (SELECT 1 FROM dbo.HistorialObservaciones)
BEGIN
    INSERT INTO dbo.HistorialObservaciones 
        (IdUsuario, CategoriaAstronomica, NombreAstro, PreguntaRealizada, RespuestaIA, FechaObservacion)
    VALUES
    -- Sistema Solar
    (@IdElena, N'Sistema Solar', N'Marte', N'¿Hace calor?', 
     N'Negativo, explorador. A pesar de su característico color rojizo, Marte presenta una temperatura promedio cercana a los -60 °C. Recomiendo activar los sistemas térmicos de la nave.', 
     DATEADD(MINUTE, -120, SYSUTCDATETIME())),
     
    (@IdElena, N'Sistema Solar', N'Júpiter', N'¿Qué es la Gran Mancha Roja?', 
     N'Análisis completado, explorador. La Gran Mancha Roja es un colosal vórtice anticiclónico que lleva activo al menos varios siglos en la atmósfera joviana.', 
     DATEADD(MINUTE, -100, SYSUTCDATETIME())),
     
    (@IdMateo, N'Sistema Solar', N'Saturno', N'¿De qué están hechos sus anillos?', 
     N'Espectrometría confirmada, explorador. Los anillos de Saturno están formados primordialmente por miles de millones de fragmentos de hielo de agua pura y polvo rocoso.', 
     DATEADD(MINUTE, -85, SYSUTCDATETIME())),
     
    (@IdLucas, N'Sistema Solar', N'Sol', N'¿Qué temperatura tiene su superficie?', 
     N'Telemetría solar recibida, explorador. La fotosfera del Sol alcanza aproximadamente 5.500 °C, mientras que su corona exterior supera el millón de grados Celsius.', 
     DATEADD(MINUTE, -60, SYSUTCDATETIME())),

    -- Constelaciones
    (@IdElena, N'Constelaciones', N'Orión', N'¿Cuáles son sus estrellas principales?', 
     N'Sistemas de orientación activos, explorador. Las estrellas alfa de Orión son Betelgeuse (supergigante roja) y Rigel (supergigante azul), enmarcadas por las tres estrellas del cinturón.', 
     DATEADD(MINUTE, -40, SYSUTCDATETIME())),
     
    (@IdMateo, N'Constelaciones', N'Osa Mayor', N'¿Qué relación tiene con la Estrella Polar?', 
     N'Cálculo de rumbo efectuado, explorador. Prolongando cinco veces la línea imaginaria entre Merak y Dubhe se localiza de forma precisa la Estrella Polar en el hemisferio norte.', 
     DATEADD(MINUTE, -30, SYSUTCDATETIME())),

    -- Galaxias
    (@IdLucas, N'Galaxias', N'Vía Láctea', N'¿Dónde se encuentra nuestro sistema solar?', 
     N'Coordenadas galácticas fijadas, explorador. Nuestro sistema solar orbita a unos 27.000 años luz del agujero negro supermasivo Sagitario A*, en el brazo espiral de Orión.', 
     DATEADD(MINUTE, -15, SYSUTCDATETIME())),
     
    (@IdElena, N'Galaxias', N'Andrómeda', N'¿Colisionará con la Vía Láctea?', 
     N'Proyección orbital confirmada, explorador. La galaxia de Andrómeda se aproxima a unos 110 km/s y se fusionará gravitacionalmente con la Vía Láctea dentro de 4.500 millones de años.', 
     DATEADD(MINUTE, -5, SYSUTCDATETIME()));

    PRINT '>> Observaciones de prueba insertadas.';
END
GO

-- ============================================================================
-- 3. CONSULTAS ANALÍTICAS REQUERIDAS POR LA ARQUITECTURA
-- ============================================================================

PRINT '----------------------------------------------------------------------------';
PRINT 'CONSULTA 1: Historial cronológico de observaciones de un explorador específico';
PRINT '----------------------------------------------------------------------------';
DECLARE @ConsultaUsuario INT = (SELECT TOP 1 IdUsuario FROM dbo.Usuarios WHERE CorreoElectronico = N'explorador.alfa@mision-espacial.org');

SELECT 
    H.IdObservacion,
    U.Nombre AS Explorador,
    H.CategoriaAstronomica AS Categoria,
    H.NombreAstro AS ObjetoExplorado,
    H.PreguntaRealizada AS Pregunta,
    H.RespuestaIA AS RespuestaComputadora,
    FORMAT(H.FechaObservacion, 'yyyy-MM-dd HH:mm:ss') AS FechaUTC
FROM dbo.HistorialObservaciones H
INNER JOIN dbo.Usuarios U ON H.IdUsuario = U.IdUsuario
WHERE H.IdUsuario = @ConsultaUsuario
ORDER BY H.FechaObservacion DESC;
GO

PRINT '----------------------------------------------------------------------------';
PRINT 'CONSULTA 2: Ranking de astros y estructuras astronómicas más visitadas';
PRINT '----------------------------------------------------------------------------';
SELECT 
    H.CategoriaAstronomica AS Categoria,
    H.NombreAstro AS Astro,
    COUNT(H.IdObservacion) AS TotalConsultas,
    CAST(COUNT(H.IdObservacion) * 100.0 / (SELECT COUNT(*) FROM dbo.HistorialObservaciones) AS DECIMAL(5,2)) AS PorcentajeInteres,
    MAX(H.FechaObservacion) AS UltimaConsultaRegistrada
FROM dbo.HistorialObservaciones H
GROUP BY H.CategoriaAstronomica, H.NombreAstro
ORDER BY TotalConsultas DESC, Astro ASC;
GO
