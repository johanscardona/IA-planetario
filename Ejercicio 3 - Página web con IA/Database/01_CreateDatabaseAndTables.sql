-- ============================================================================
-- PROYECTO ASTRONOMÍA 3D - PLATAFORMA DE EXPLORACIÓN ESPACIAL CON IA
-- SCRIPT DDL: CREACIÓN DE BASE DE DATOS Y TABLAS (SQL SERVER / T-SQL)
-- ============================================================================

USE master;
GO

-- 1. Crear Base de Datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'PlanetarioDB')
BEGIN
    CREATE DATABASE PlanetarioDB
    COLLATE Modern_Spanish_CI_AS;
    PRINT '>> Base de datos [PlanetarioDB] creada exitosamente.';
END
ELSE
BEGIN
    PRINT '>> Base de datos [PlanetarioDB] ya existe.';
END
GO

USE PlanetarioDB;
GO

-- 2. Eliminar tablas previas en orden de dependencia (si existen)
IF OBJECT_ID(N'dbo.HistorialObservaciones', N'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.HistorialObservaciones;
    PRINT '>> Tabla [HistorialObservaciones] eliminada para regeneración limpia.';
END
GO

IF OBJECT_ID(N'dbo.Usuarios', N'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.Usuarios;
    PRINT '>> Tabla [Usuarios] eliminada para regeneración limpia.';
END
GO

-- ============================================================================
-- 3. TABLA: Usuarios
-- Almacena los exploradores registrados en la plataforma.
-- ============================================================================
CREATE TABLE dbo.Usuarios (
    IdUsuario           INT IDENTITY(1,1) NOT NULL,
    Nombre              NVARCHAR(100) NOT NULL,
    CorreoElectronico   NVARCHAR(150) NOT NULL,
    PasswordHash        NVARCHAR(256) NOT NULL,
    FechaRegistro       DATETIME2(7) NOT NULL CONSTRAINT DF_Usuarios_FechaRegistro DEFAULT (SYSUTCDATETIME()),
    Estado              BIT NOT NULL CONSTRAINT DF_Usuarios_Estado DEFAULT (1), -- 1: Activo, 0: Inactivo
    
    -- Clave Primaria
    CONSTRAINT PK_Usuarios PRIMARY KEY CLUSTERED (IdUsuario ASC),
    
    -- Restricción de Unicidad para el Correo
    CONSTRAINT UQ_Usuarios_CorreoElectronico UNIQUE NONCLUSTERED (CorreoElectronico ASC),
    
    -- Restricción para validar formato básico de correo
    CONSTRAINT CK_Usuarios_CorreoElectronico CHECK (CorreoElectronico LIKE '%_@__%.__%')
);
PRINT '>> Tabla [Usuarios] creada correctamente.';
GO

-- ============================================================================
-- 4. TABLA: HistorialObservaciones
-- Registra cada interacción y consulta astronómica realizada a la IA de a bordo.
-- Incluye la CategoriaAstronomica para Sistema Solar, Constelaciones y Galaxias.
-- ============================================================================
CREATE TABLE dbo.HistorialObservaciones (
    IdObservacion        INT IDENTITY(1,1) NOT NULL,
    IdUsuario            INT NULL, -- Nullable para permitir observaciones de visitantes/invitados
    CategoriaAstronomica NVARCHAR(50) NOT NULL,
    NombreAstro          NVARCHAR(100) NOT NULL,
    PreguntaRealizada    NVARCHAR(500) NOT NULL,
    RespuestaIA          NVARCHAR(1500) NOT NULL,
    FechaObservacion     DATETIME2(7) NOT NULL CONSTRAINT DF_Historial_FechaObservacion DEFAULT (SYSUTCDATETIME()),
    
    -- Clave Primaria
    CONSTRAINT PK_HistorialObservaciones PRIMARY KEY CLUSTERED (IdObservacion ASC),
    
    -- Clave Foránea referenciando a Usuarios
    CONSTRAINT FK_HistorialObservaciones_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES dbo.Usuarios (IdUsuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
        
    -- Validación de Categoría Astronómica
    CONSTRAINT CK_Historial_Categoria CHECK (
        CategoriaAstronomica IN (N'Sistema Solar', N'Constelaciones', N'Galaxias')
    )
);
PRINT '>> Tabla [HistorialObservaciones] creada correctamente.';
GO

-- ============================================================================
-- 5. ÍNDICES NO CLUSTERIZADOS PARA RENDIMIENTO DE CONSULTAS
-- ============================================================================

-- Índice para acelerar la búsqueda de historial por usuario y fecha
CREATE NONCLUSTERED INDEX IX_HistorialObservaciones_Usuario_Fecha
ON dbo.HistorialObservaciones (IdUsuario, FechaObservacion DESC)
INCLUDE (NombreAstro, CategoriaAstronomica, PreguntaRealizada);
GO

-- Índice para el ranking y estadísticas de astros más consultados
CREATE NONCLUSTERED INDEX IX_HistorialObservaciones_NombreAstro
ON dbo.HistorialObservaciones (NombreAstro, CategoriaAstronomica)
INCLUDE (FechaObservacion);
GO

PRINT '>> Índices creados satisfactoriamente.';
GO
