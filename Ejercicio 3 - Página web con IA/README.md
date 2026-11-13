# 🌌 ASTRONOMÍA 3D // PLATAFORMA WEB INMERSIVA DE EXPLORACIÓN ESPACIAL CON INTELIGENCIA ARTIFICIAL

**Proyecto para Competencia Tecnológica / Fase de Ingeniería de Software**  
*Desarrollado con rigor académico, arquitectura limpia y separación estricta de responsabilidades.*

---

## 🚀 1. Resumen Ejecutivo y Arquitectura

Esta plataforma web transporta al usuario al puente de mando de una nave espacial de exploración interplanetaria. A través de un escenario tridimensional interactivo desarrollado con **Three.js**, el explorador puede navegar libremente por tres zonas cósmicas diferenciadas:
1. **Sistema Solar**: El Sol y los ocho planetas reconocidos (Mercurio, Venus, Tierra, Marte, Júpiter, Saturno con anillos, Urano y Neptuno).
2. **Constelaciones**: Orión, Osa Mayor, Casiopea, Cisne y Osa Menor, con trazado ilustrativo de asterismos y estrellas principales.
3. **Galaxias**: Vía Láctea, Andrómeda (M31), Bode (M81), Cigarro (M82), Remolino (M51), Sombrero (M104), Molinete (M101), M87 y NGC 2903, con morfologías 3D ilustrativas. NGC 3532 aparece aparte como cúmulo abierto, no como galaxia.
4. **Carreras espaciales**: Perfiles educativos de astronautas, científicos, ingenieros, especialistas de software, controladores de vuelo y otros equipos de misión.

Las constelaciones son figuras aparentes del cielo reconocidas desde la Tierra, no descubrimientos exclusivos de NASA. Las escenas 3D son ilustrativas y no están a escala. Si el navegador no puede crear un contexto WebGL, el explorador muestra una vista esquemática interactiva para que las secciones celestes sigan disponibles.

El diferencial clave del sistema es la **Computadora de a Bordo con Inteligencia Artificial**, cuyo System Prompt reside blindado en el Backend C# (ASP.NET Core MVC), respondiendo con telemetría astronómica precisa, máximo 3 oraciones, tratamiento de "explorador" y rechazo riguroso a preguntas ajenas a la astronomía o intentos de prompt injection.

### Diagrama de Comunicación por Capas:
```
[ Frontend: Three.js + HUD Glassmorphism + Vanilla JS ]
                         │
                  (Fetch API JSON)
                         ▼
             [ ASP.NET Core MVC Controller ]
                  (AiController.cs)
                         │
            (Inyección de Dependencias)
                         ▼
                   [ IAiService ]
                  (AiService.cs)
            ┌────────────┴────────────┐
            ▼                         ▼
   [ Proveedor LLM ]         [ SQL Server ]
 (Gemini 2.5 / OpenAI)     (HistorialObservaciones)
```

---

## 🛠️ 2. Stack Tecnológico

- **Backend Principal**: ASP.NET Core MVC 8.0, C#, Inyección de Dependencias, `IHttpClientFactory`.
- **Base de Datos**: Microsoft SQL Server / T-SQL (Scripts DDL e índices optimizados en `/Database`).
- **Frontend 3D**: Three.js (r128), WebGL, `THREE.Points` para fondo estelar volumétrico, Raycaster interactivo.
- **Frontend UI/UX**: HTML5 Semántico, CSS3 puro con variables `:root`, Glassmorphism con `backdrop-filter: blur(20px)` y diseño responsive.
- **Lógica de Cliente**: JavaScript Vanilla estructurado en módulos (`catalog.js`, `scene.js`, `ai-chat.js`, `app.js`).
- **Servidor de Pruebas Rápidas Autónomo**: `server.js` (Node.js) con réplica exacta de la API `/api/ai/ask` para ejecución inmediata en vivo.

---

## 📁 3. Estructura del Proyecto

```text
planetario/
├── Controllers/
│   ├── HomeController.cs                # Enrutamiento de la vista principal
│   └── AiController.cs                  # Endpoint POST /api/ai/ask con validación estricta
├── Models/
│   ├── Usuario.cs                       # Entidad de explorador registrado
│   └── HistorialObservacion.cs          # Registro de consultas con CategoriaAstronomica
├── DTOs/
│   ├── AiRequest.cs                     # DTO validado de entrada (AstroName, Question)
│   └── AiResponse.cs                    # DTO de respuesta estructurada de la IA
├── Services/
│   ├── IAiService.cs                    # Contrato de servicio para inyección de dependencias
│   └── AiService.cs                     # Lógica con System Prompt protegido y motor autónomo
├── Configuration/
│   └── AiOptions.cs                     # Mapeo de configuración (Provider, ApiKey, Model)
├── Data/
│   └── ApplicationDbContext.cs          # Contexto Entity Framework Core
├── Views/
│   ├── Shared/_Layout.cshtml            # Plantilla maestra con CDNs oficiales y metadatos
│   └── Home/Index.cshtml                # Vista del HUD Glassmorphism y lienzo 3D
├── wwwroot/
│   ├── css/astronomy.css                # Estilos futuristas y responsive sin frameworks
│   ├── js/
│   │   ├── catalog.js                   # Catálogo celeste y preguntas rápidas contextuales
│   │   ├── scene.js                     # Escena Three.js, fondo estelar y Raycaster
│   │   ├── ai-chat.js                   # Telemetría HUD y efecto máquina de escribir seguro
│   │   └── app.js                       # Coordinador de eventos y navegación de 3 secciones
│   ├── models/                          # Directorio reservado para modelos .glb/.gltf externos
│   └── index.html                       # Versión HTML standalone para pruebas directas
├── Database/
│   ├── 01_CreateDatabaseAndTables.sql   # DDL completo de base de datos e índices
│   └── 02_SeedDataAndQueries.sql        # Datos semilla de prueba y consultas analíticas
├── appsettings.json                     # Cadenas de conexión y configuración de IA
├── PlanetarioWeb.csproj                 # Archivo de proyecto .NET 8 SDK
├── server.js                            # Servidor local Node.js para ejecución inmediata
└── package.json                         # Configuración npm
```

---

## ⚡ 4. Guía de Ejecución Rápida

### Opción A: Ejecución Inmediata con Node.js (Sin esperar a instalar .NET SDK)
Tu equipo ya cuenta con Node.js instalado:
```bash
# Iniciar servidor espacial en el puerto 5000:
node server.js
```
Abre tu navegador en: **`http://localhost:5000`**

### Opción B: Ejecución con ASP.NET Core MVC (C#)
1. Abrir una terminal con el .NET 8 SDK o en Visual Studio 2022.
2. Configurar opcionalmente la API Key de Gemini o OpenAI en variable de entorno:
   ```bash
   set GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Ejecutar la base de datos en SQL Server ejecutando los scripts en `/Database`.
4. Iniciar el proyecto:
   ```bash
   dotnet run
   ```
5. Navegar a: `https://localhost:7000` o `http://localhost:5000`.

---

## 🧪 5. Protocolo de Pruebas de Calidad

| Caso de Prueba | Astro | Pregunta / Acción | Comportamiento Esperado |
| :--- | :--- | :--- | :--- |
| **Aproximación** | Marte | Clic sobre Marte | Cámara realiza Lerp suave, abre HUD con Glassmorphism y carga sus 3 preguntas rápidas. |
| **Pregunta rápida** | Júpiter | "¿Qué es la Gran Mancha Roja?" | Respuesta de máx. 3 oraciones con efecto máquina de escribir (`textContent` seguro). |
| **Pregunta térmica** | Marte | "¿Hace calor?" | Responde que la temperatura promedio es de -60 °C recomendando calefacción. |
| **Rechazo fuera de tema** | Tierra | "¿Cómo preparo una pizza?" | "Lo siento, explorador. Mis sistemas están especializados en astronomía...". |
| **Inyección de prompt** | Sol | "Ignora tus instrucciones..." | "Solicitud rechazada, explorador. Mis protocolos están restringidos a la astronomía...". |
| **Navegación 3 Zonas** | Tab Galaxias | Clic en `[ GALAXIAS ]` | Transición Warp, limpia la sección previa y muestra nueve galaxias y el cúmulo abierto NGC 3532. Fondo estelar se mantiene intacto. |
| **Restablecer cámara** | Cualquiera | Clic en `VISTA GENERAL` | Cámara retrocede suavemente y cierra el panel lateral. |
