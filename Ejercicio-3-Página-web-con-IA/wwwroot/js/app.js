/**
 * ============================================================================
 * ASTRONOMÍA 3D - CONTROLADOR MAESTRO DE APLICACIÓN (APP.JS)
 * Coordinación de interfaz de usuario, navegación entre las 3 grandes secciones,
 * enlace de eventos entre Three.js y el HUD de IA.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Referencias directas al DOM (Declaradas al inicio para evitar TDZ / ReferenceError)
    const navTabs = document.querySelectorAll(".nav-tab");
    const btnResetCamera = document.getElementById("btn-reset-camera");
    const warpOverlay = document.getElementById("warp-overlay");
    const hintText = document.getElementById("hint-text");
    const contentPortals = document.querySelectorAll(".content-portal");
    const sectionTitle = document.getElementById("section-title");
    const sectionDescription = document.getElementById("section-description");
    const sectionCount = document.getElementById("section-object-count");
    const overviewIndex = document.getElementById("overview-index");
    const dockTitle = document.getElementById("dock-title");
    const objectDockItems = document.getElementById("object-dock-items");
    const activeObjectName = document.getElementById("active-object-name");
    const astronomyCatalog = window.AstronomyCatalog;

    const sectionNumbers = {
        sistemaSolar: "01",
        constelaciones: "02",
        galaxias: "03"
    };
    const sceneFallback = document.getElementById("scene-fallback");
    let sceneUsesFallback = false;
    let currentSceneSection = "sistemaSolar";
    const editorialPortalIds = {
        nasa: "nasa-portal",
        carreras: "careers-portal"
    };

    function updateSectionInterface(sectionKey) {
        const section = astronomyCatalog && astronomyCatalog[sectionKey];
        if (!section) return;

        if (sectionTitle) sectionTitle.textContent = section.label;
        if (sectionDescription) sectionDescription.textContent = section.description;
        if (sectionCount) sectionCount.textContent = section.objects.length;
        if (overviewIndex) overviewIndex.textContent = sectionNumbers[sectionKey] || "00";
        if (dockTitle) dockTitle.textContent = section.label;
        setActiveObject(null);
        const navCount = document.getElementById(`count-${sectionKey}`);
        if (navCount) navCount.textContent = section.objects.length;
        if (objectDockItems) {
            objectDockItems.replaceChildren();
            section.objects.forEach((astroData, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "dock-object";
                button.dataset.objectId = astroData.id;
                button.style.setProperty("--object-color", getObjectColor(astroData, index));
                button.setAttribute("aria-label", `Explorar ${astroData.name}`);
                button.setAttribute("aria-pressed", "false");

                const dot = document.createElement("span");
                dot.className = "dock-object-dot";
                dot.setAttribute("aria-hidden", "true");

                const name = document.createElement("span");
                name.textContent = astroData.name;
                button.append(dot, name);
                button.addEventListener("click", () => {
                    if (sceneUsesFallback) {
                        selectFallbackObject(astroData);
                    } else if (window.SpaceScene) {
                        window.SpaceScene.focusObject(astroData);
                    }
                });
                objectDockItems.appendChild(button);
            });
        }
    }

    function selectFallbackObject(astroData) {
        setActiveObject(astroData);
        sceneFallback?.querySelectorAll(".fallback-object").forEach((object) => {
            const isSelected = object.dataset.objectId === astroData.id;
            object.classList.toggle("active", isSelected);
            object.setAttribute("aria-pressed", isSelected ? "true" : "false");
        });
        window.AiChatManager?.openAstroHud(astroData);
        updateInteractionHint(`Explorando ${astroData.name}. Vista esquemática 2D activa.`);
    }

    function renderFallbackScene(sectionKey) {
        const section = astronomyCatalog?.[sectionKey];
        if (!sceneFallback || !section) return;

        currentSceneSection = sectionKey;
        sceneFallback.replaceChildren();
        sceneFallback.className = `scene-fallback fallback-${sectionKey}`;
        sceneFallback.hidden = false;
        sceneFallback.setAttribute("aria-hidden", "false");

        const notice = document.createElement("div");
        notice.className = "fallback-notice";
        notice.textContent = "Vista esquemática · No se pudo iniciar la escena 3D.";
        sceneFallback.appendChild(notice);

        const stage = document.createElement("div");
        stage.className = "fallback-stage";
        sceneFallback.appendChild(stage);

        if (sectionKey === "sistemaSolar") {
            renderSolarFallback(stage, section.objects);
        } else if (sectionKey === "constelaciones") {
            renderConstellationFallback(stage, section.objects);
        } else if (sectionKey === "galaxias") {
            renderGalaxyFallback(stage, section.objects);
        }
    }

    function createFallbackObject(data, className = "") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `fallback-object ${className}`.trim();
        button.dataset.objectId = data.id;
        button.setAttribute("aria-label", `Explorar ${data.name}`);
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => selectFallbackObject(data));
        return button;
    }

    function renderSolarFallback(stage, objects) {
        const sun = objects.find((object) => object.visual.type === "sun");
        const planets = objects.filter((object) => object.visual.orbitRadius);
        const maxOrbit = Math.max(...planets.map((object) => object.visual.orbitRadius));

        planets.forEach((planet) => {
            const orbit = document.createElement("div");
            orbit.className = "fallback-orbit";
            orbit.style.setProperty("--orbit-size", `${(planet.visual.orbitRadius / maxOrbit) * 90}%`);
            stage.appendChild(orbit);
        });

        const belt = document.createElement("div");
        belt.className = "fallback-asteroid-belt";
        stage.appendChild(belt);

        if (sun) {
            const sunButton = createFallbackObject(sun, "fallback-sun");
            sunButton.style.setProperty("--body-color", `#${sun.visual.color.toString(16).padStart(6, "0")}`);
            const sunSize = Math.round((sun.visual.radius / maxOrbit) * stage.clientWidth * 0.9);
            sunButton.style.setProperty("--body-size", `${sunSize}px`);
            sunButton.style.left = "50%";
            sunButton.style.top = "50%";
            sunButton.innerHTML = '<span class="fallback-body"></span><span class="fallback-label"></span>';
            sunButton.querySelector(".fallback-label").textContent = sun.name;
            stage.appendChild(sunButton);
        }

        planets.forEach((planet) => {
            const visual = planet.visual;
            const object = createFallbackObject(planet, "fallback-planet");
            const color = visual.color || 0x7dd3fc;
            const size = Math.max(12, Math.min(visual.radius * 3.2, 42));
            const max = maxOrbit * 1.12;
            object.style.setProperty("--body-color", `#${color.toString(16).padStart(6, "0")}`);
            object.style.setProperty("--body-size", `${size}px`);
            const positionRadius = Math.hypot(visual.position.x, visual.position.z) || visual.orbitRadius;
            const orbitScale = visual.orbitRadius / positionRadius;
            object.style.left = `${50 + (visual.position.x * orbitScale / max) * 45}%`;
            object.style.top = `${50 + (visual.position.z * orbitScale / max) * 45}%`;
            object.innerHTML = '<span class="fallback-body"></span><span class="fallback-label"></span>';
            object.querySelector(".fallback-label").textContent = planet.name;
            if (visual.hasRings) object.classList.add("has-rings");
            stage.appendChild(object);
        });
    }

    function renderConstellationFallback(stage, objects) {
        const columns = Math.min(3, objects.length);
        objects.forEach((data, index) => {
            const card = createFallbackObject(data, "fallback-constellation");
            const column = index % columns;
            const row = Math.floor(index / columns);
            card.style.left = `${18 + (column * 64) / Math.max(columns - 1, 1)}%`;
            card.style.top = `${28 + row * 38}%`;

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 100 100");
            svg.setAttribute("aria-hidden", "true");
            const stars = data.visual.stars;
            const xs = stars.map((star) => star.pos[0]);
            const ys = stars.map((star) => star.pos[1]);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const point = (star) => ({
                x: 12 + ((star.pos[0] - minX) / (maxX - minX || 1)) * 76,
                y: 12 + (1 - (star.pos[1] - minY) / (maxY - minY || 1)) * 76
            });

            data.visual.lines.forEach(([start, end]) => {
                const from = point(stars[start]);
                const to = point(stars[end]);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", from.x);
                line.setAttribute("y1", from.y);
                line.setAttribute("x2", to.x);
                line.setAttribute("y2", to.y);
                svg.appendChild(line);
            });

            stars.forEach((star) => {
                const position = point(star);
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", position.x);
                circle.setAttribute("cy", position.y);
                circle.setAttribute("r", Math.max(1.7, star.size * 2.2));
                circle.style.setProperty("--star-color", `#${star.color.toString(16).padStart(6, "0")}`);
                svg.appendChild(circle);
            });

            const label = document.createElement("span");
            label.className = "fallback-label";
            label.textContent = data.name;
            card.append(svg, label);
            stage.appendChild(card);
        });
    }

    function renderGalaxyFallback(stage, objects) {
        const columns = Math.min(window.innerWidth < 700 ? 2 : 4, objects.length);
        const rows = Math.ceil(objects.length / columns);
        objects.forEach((data, index) => {
            const card = createFallbackObject(data, "fallback-galaxy");
            const column = index % columns;
            const row = Math.floor(index / columns);
            card.style.left = `${((column + 0.5) * 100) / columns}%`;
            card.style.top = `${28 + (row * 54) / Math.max(rows - 1, 1)}%`;
            const galaxy = document.createElement("span");
            galaxy.className = `fallback-galaxy-art morphology-${data.visual.morphology || "spiral"}`;
            galaxy.style.setProperty("--galaxy-color", `#${(data.visual.armColor || 0x7dd3fc).toString(16).padStart(6, "0")}`);
            const label = document.createElement("span");
            label.className = "fallback-label";
            label.textContent = data.name;
            card.append(galaxy, label);
            stage.appendChild(card);
        });
    }

    function getObjectColor(astroData, index) {
        if (astroData.visual.color) return `#${astroData.visual.color.toString(16).padStart(6, "0")}`;
        if (astroData.visual.armColor) return `#${astroData.visual.armColor.toString(16).padStart(6, "0")}`;
        const palette = ["#7dd3fc", "#c4b5fd", "#fda4af", "#fde68a", "#86efac"];
        return palette[index % palette.length];
    }

    function setActiveObject(astroData) {
        if (activeObjectName) activeObjectName.textContent = astroData ? astroData.name.toUpperCase() : "NINGUNO";
        objectDockItems?.querySelectorAll(".dock-object").forEach((button) => {
            const selected = astroData && button.dataset.objectId === astroData.id;
            button.classList.toggle("active", Boolean(selected));
            button.setAttribute("aria-pressed", selected ? "true" : "false");
        });
    }

    // 2. Funciones de actualización de instrucciones contextuales
    function updateInteractionHint(text) {
        if (hintText) {
            hintText.textContent = text;
        }
    }

    function updateHintForSection(sectionKey) {
        if (sectionKey === "sistemaSolar") {
            updateInteractionHint("Explorando Sistema Solar. Haz clic en el Sol o en cualquiera de los 8 planetas para iniciar aproximación.");
        } else if (sectionKey === "constelaciones") {
            updateInteractionHint("Explorando constelaciones. Selecciona Orión, Casiopea, Cisne, Osa Mayor u Osa Menor para conocer sus estrellas.");
        } else if (sectionKey === "galaxias") {
            updateInteractionHint("Explorando galaxias observadas por NASA. Selecciona una para conocer su forma, estructura y observaciones.");
        }
    }

    // 3. Navegación entre las secciones 3D y el portal editorial
    navTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const sectionKey = tab.getAttribute("data-section");
            if (!sectionKey || tab.classList.contains("active")) return;

            // Actualizar pestañas visuales
            navTabs.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-pressed", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-pressed", "true");

            // Cerrar HUD previo
            if (window.AiChatManager) {
                window.AiChatManager.closeHud();
            }

            if (editorialPortalIds[sectionKey]) {
                setActiveObject(null);
                contentPortals.forEach((portal) => {
                    portal.hidden = portal.id !== editorialPortalIds[sectionKey];
                });
                document.querySelector(".app-viewport")?.classList.add("editorial-section-active");
                window.scrollTo(0, 0);
                return;
            }

            contentPortals.forEach((portal) => {
                portal.hidden = true;
            });
            document.querySelector(".app-viewport")?.classList.remove("editorial-section-active");
            updateSectionInterface(sectionKey);

            if (sceneUsesFallback) {
                renderFallbackScene(sectionKey);
                updateHintForSection(sectionKey);
                return;
            }

            // Efecto óptico de transición Warp
            if (warpOverlay) {
                warpOverlay.classList.add("active");
                setTimeout(() => {
                    // Cargar nueva sección en Three.js
                    if (window.SpaceScene) {
                        window.SpaceScene.loadSection(sectionKey);
                    }
                    updateHintForSection(sectionKey);
                    setTimeout(() => {
                        warpOverlay.classList.remove("active");
                    }, 250);
                }, 200);
            } else {
                if (window.SpaceScene) {
                    window.SpaceScene.loadSection(sectionKey);
                }
                updateHintForSection(sectionKey);
            }
        });
    });

    // 4. Botón de Restablecimiento de Cámara ("Vista General")
    if (btnResetCamera) {
        btnResetCamera.addEventListener("click", () => {
            if (sceneUsesFallback) {
                sceneFallback?.querySelectorAll(".fallback-object.active").forEach((object) => {
                    object.classList.remove("active");
                    object.setAttribute("aria-pressed", "false");
                });
                setActiveObject(null);
                window.AiChatManager?.closeHud();
            } else if (window.SpaceScene) {
                window.SpaceScene.resetCamera();
                window.AiChatManager?.closeHud();
            }
            updateHintForSection(sceneUsesFallback
                ? currentSceneSection
                : window.SpaceScene?.getCurrentSection() || "sistemaSolar");
        });
    }

    // 5. Inicialización de los submódulos de la aplicación
    if (window.AiChatManager) {
        window.AiChatManager.init();
    }

    // Renderizar la interfaz incluso si el navegador no logra crear WebGL.
    updateSectionInterface("sistemaSolar");
    updateHintForSection("sistemaSolar");

    try {
        if (!window.SpaceScene) {
            throw new Error("El módulo de escenas 3D no está disponible.");
        }

        window.SpaceScene.init(
            "webgl-canvas",
            (astroData) => {
                window.AiChatManager?.openAstroHud(astroData);
                setActiveObject(astroData);
                updateInteractionHint(
                    `Explorando ${astroData.name}. Consulta a la computadora de a bordo en el panel lateral.`
                );
            },
            (sectionKey) => {
                window.AiChatManager?.closeHud();
                setActiveObject(null);
                updateHintForSection(sectionKey);
            }
        );
    } catch (error) {
        console.error("No se pudo iniciar la escena 3D; se mostrará la vista esquemática.", error);
        sceneUsesFallback = true;
        const canvas = document.getElementById("webgl-canvas");
        if (canvas) canvas.hidden = true;
        renderFallbackScene("sistemaSolar");
    }

    console.log(">> Navegación y Sistemas de Exploración Espacial 3D inicializados con éxito.");
});
