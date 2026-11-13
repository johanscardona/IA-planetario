/**
 * ============================================================================
 * ASTRONOMÍA 3D - ESCENARIO THREE.JS, FONDO ESTELAR Y RAYCASTER INTERACTIVO
 * ============================================================================
 */

const SpaceScene = (() => {
    // Variables de Three.js
    let scene, camera, renderer, controls;
    let canvasElement;
    let starField; // THREE.Points decorativo no interactivo

    // Grupos de la escena
    let backgroundGroup;     // Elementos exclusivamente decorativos (estrellas de fondo)
    let activeSectionGroup;  // Objetos de la sección activa (Sistema Solar, Constelaciones o Galaxias)
    let objectLabelLayer;
    let objectLabels = [];
    
    // Colección estricta de objetos interactivos para el Raycaster
    let interactiveObjects = [];

    // Raycaster y puntero
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseDown = false;
    let mouseDownPos = { x: 0, y: 0 };

    // Control de interpolación suave de cámara (Lerp)
    let isLerpingCamera = false;
    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3();

    // Estado de la sección actual
    let currentSectionKey = "sistemaSolar";
    let selectedObjectData = null;

    // Callbacks hacia la interfaz externa
    let onObjectSelectCallback = null;
    let onGeneralViewCallback = null;

    // Reloj para animaciones
    const clock = new THREE.Clock();

    /**
     * Inicializa el motor Three.js, luces, fondo estelar y eventos.
     */
    function init(canvasId, onSelect, onReset) {
        canvasElement = document.getElementById(canvasId);
        onObjectSelectCallback = onSelect;
        onGeneralViewCallback = onReset;
        objectLabelLayer = document.getElementById("object-labels");

        // 1. Escena
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050814, 0.0012);

        // 2. Cámara
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
        camera.position.set(0, 45, 120);
        currentLookAt.set(0, 0, 0);
        targetLookAt.set(0, 0, 0);
        targetCameraPos.copy(camera.position);

        // 3. Renderer WebGL
        renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

        // 4. OrbitControls oficiales
        if (typeof THREE.OrbitControls !== "undefined") {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxDistance = 500;
            controls.minDistance = 3;
            controls.target.copy(currentLookAt);
        }

        // 5. Grupos jerárquicos
        backgroundGroup = new THREE.Group();
        backgroundGroup.name = "BackgroundDecorations";
        scene.add(backgroundGroup);

        activeSectionGroup = new THREE.Group();
        activeSectionGroup.name = "ActiveAstronomicalSection";
        scene.add(activeSectionGroup);

        // 6. Iluminación Ambiental y de Relleno
        setupLighting();

        // 7. Generación del Fondo Estelar Inmersivo Decorativo (REGLA 5: No interactivo)
        createStarField();

        // 8. Carga inicial de la sección Sistema Solar
        loadSection("sistemaSolar");

        // 9. Eventos de interacción
        setupEventListeners();

        // 10. Bucle de Renderizado
        animate();
    }

    /**
     * Configuración de la iluminación base del escenario.
     */
    function setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
        dirLight.position.set(40, 80, 50);
        scene.add(dirLight);

        const fillLight = new THREE.PointLight(0x38bdf8, 0.8, 400);
        fillLight.position.set(-80, -30, -50);
        scene.add(fillLight);
    }

    /**
     * ========================================================================
     * FONDO ESTELAR INMERSIVO CON ESTRELLAS DECORATIVAS (REQUISITO SECCIÓN 2)
     * Utiliza THREE.Points, BufferGeometry y PointsMaterial.
     * NUNCA se añade a interactiveObjects -> Raycaster permanece puro.
     * ========================================================================
     */
    function createStarField() {
        const starCount = 6500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        const colorPalette = [
            new THREE.Color(0xffffff), // Blanco puro
            new THREE.Color(0xa5c9ff), // Azul estelar tenue
            new THREE.Color(0xd8b4fe), // Violeta tenue
            new THREE.Color(0x7dd3fc), // Cian suave
            new THREE.Color(0xffedd5)  // Dorado tenue
        ];

        // Distribución esférica natural con profundidad cósmica
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Radio finito y controlado entre 250 y 650
            const radius = 250 + Math.random() * 400;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Tonalidad aleatoria de la paleta astronómica
            const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            const luminosity = 0.5 + Math.random() * 0.5;

            colors[i3]     = chosenColor.r * luminosity;
            colors[i3 + 1] = chosenColor.g * luminosity;
            colors[i3 + 2] = chosenColor.b * luminosity;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Textura procedural circular para puntos estelares suaves
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        const starTexture = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            size: 2.8,
            map: starTexture,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false
        });

        starField = new THREE.Points(geometry, material);
        starField.name = "DecorativeStarField_NonInteractive";

        // CRÍTICO: Se añade a backgroundGroup y NO a interactiveObjects
        backgroundGroup.add(starField);
    }

    /**
     * ========================================================================
     * CAMBIO Y CARGA DE LAS TRES GRANDES SECCIONES (REQUISITO SECCIÓN 4 Y 7)
     * ========================================================================
     */
    function loadSection(sectionKey) {
        const catalog = window.AstronomyCatalog || (typeof AstronomyCatalog !== 'undefined' ? AstronomyCatalog : null);
        if (!catalog || !catalog[sectionKey]) return;

        currentSectionKey = sectionKey;
        selectedObjectData = null;

        // 1. Limpieza rigurosa de memoria y objetos de la sección anterior
        disposeGroup(activeSectionGroup);
        interactiveObjects = []; // Reseteo estricto del Raycaster

        const sectionData = catalog[sectionKey];

        // 2. Construcción visual según la categoría
        if (sectionKey === "sistemaSolar") {
            buildSolarSystem(sectionData.objects);
        } else if (sectionKey === "constelaciones") {
            buildConstellations(sectionData.objects);
        } else if (sectionKey === "galaxias") {
            buildGalaxies(sectionData.objects);
        }
        createObjectLabels(sectionData.objects);

        // 3. Posicionamiento suave de la cámara a la vista general de la sección
        resetCamera();
    }

    function createObjectLabels(objects) {
        if (!objectLabelLayer) return;

        objectLabelLayer.replaceChildren();
        objectLabels = objects.map((astroData) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "celestial-label";
            button.dataset.objectId = astroData.id;
            button.textContent = astroData.name;
            button.setAttribute("aria-label", `Enfocar ${astroData.name}`);
            button.setAttribute("aria-pressed", "false");
            button.addEventListener("click", () => focusObject(astroData));
            objectLabelLayer.appendChild(button);

            const visual = astroData.visual;
            const group = activeSectionGroup.children.find(
                (child) => child.userData?.astroData?.id === astroData.id
            );
            const extent = visual.radius || 0;
            const ringExtent = visual.ringOuter || extent;
            const labelHeight = currentSectionKey === "constelaciones"
                ? 18
                : Math.max(extent, ringExtent) + Math.max(2, extent * 0.12);

            return {
                astroData,
                button,
                group,
                localPosition: new THREE.Vector3(0, labelHeight, 0)
            };
        });
    }

    function updateObjectLabels() {
        if (!objectLabelLayer || !camera) return;

        camera.updateMatrixWorld();
        const width = window.innerWidth;
        const height = window.innerHeight;
        objectLabels.forEach(({ astroData, button, group, localPosition }) => {
            if (!group) {
                button.hidden = true;
                return;
            }

            const projected = group.localToWorld(localPosition.clone()).project(camera);
            const isVisible = projected.z > -1 && projected.z < 1
                && Math.abs(projected.x) < 0.96
                && Math.abs(projected.y) < 0.96;
            button.hidden = !isVisible;
            if (!isVisible) return;

            button.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
            button.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
            const isSelected = selectedObjectData?.id === astroData.id;
            button.classList.toggle("active", isSelected);
            button.setAttribute("aria-pressed", isSelected ? "true" : "false");
        });
    }

    /**
     * ========================================================================
     * CONSTRUCCIÓN: SECCIÓN 1 - SISTEMA SOLAR (Sol + 8 Planetas)
     * ========================================================================
     */
    function createSolarOrbits(planetsData) {
        const orbitRadii = planetsData
            .map(({ visual }) => visual.orbitRadius)
            .filter((radius) => Number.isFinite(radius));

        orbitRadii.forEach((radius) => {
            const positions = [];
            const segments = 256;
            for (let i = 0; i < segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                positions.push(
                    Math.cos(angle) * radius,
                    -0.35,
                    Math.sin(angle) * radius
                );
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            const orbit = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({
                color: 0x526174,
                transparent: true,
                opacity: 0.34,
                depthWrite: false
            }));
            orbit.name = "solar_orbit";
            activeSectionGroup.add(orbit);
        });

        const random = createSeededRandom("solar-asteroid-belt");
        const asteroidPositions = [];
        for (let i = 0; i < 1800; i++) {
            const angle = random() * Math.PI * 2;
            const radius = 116 + random() * 12;
            asteroidPositions.push(
                Math.cos(angle) * radius,
                (random() - 0.5) * 2.2,
                Math.sin(angle) * radius
            );
        }

        const beltGeometry = new THREE.BufferGeometry();
        beltGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(asteroidPositions, 3)
        );
        const asteroidBelt = new THREE.Points(beltGeometry, new THREE.PointsMaterial({
            color: 0xb9a98c,
            size: 1.05,
            transparent: true,
            opacity: 0.68,
            sizeAttenuation: true,
            depthWrite: false
        }));
        asteroidBelt.name = "solar_asteroid_belt";
        activeSectionGroup.add(asteroidBelt);
    }

    function buildSolarSystem(planetsData) {
        createSolarOrbits(planetsData);

        planetsData.forEach((data) => {
            const visual = data.visual;
            const planetGroup = new THREE.Group();
            planetGroup.position.set(visual.position.x, visual.position.y, visual.position.z);
            planetGroup.userData = { astroData: data };

            if (visual.type === "sun") {
                // Photosphere and layered corona are illustrative, not a NASA image.
                const sunGeo = new THREE.SphereGeometry(visual.radius, 96, 64);
                const sunTexture = createSolarTexture();
                sunTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture, color: 0xffffff });
                const sunMesh = new THREE.Mesh(sunGeo, sunMat);
                sunMesh.name = "sun_photosphere";
                sunMesh.userData = { astroData: data };
                planetGroup.add(sunMesh);

                const innerCorona = new THREE.Mesh(
                    new THREE.SphereGeometry(visual.radius * 1.14, 48, 32),
                    new THREE.MeshBasicMaterial({
                        color: 0xff9b32,
                        side: THREE.BackSide,
                        transparent: true,
                        opacity: 0.42,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    })
                );
                innerCorona.name = "sun_inner_corona";
                planetGroup.add(innerCorona);

                const outerCorona = new THREE.Mesh(
                    new THREE.SphereGeometry(visual.radius * 1.42, 48, 32),
                    new THREE.MeshBasicMaterial({
                        color: 0xff641e,
                        side: THREE.BackSide,
                        transparent: true,
                        opacity: 0.14,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    })
                );
                outerCorona.name = "sun_outer_corona";
                planetGroup.add(outerCorona);

                const glowCanvas = document.createElement("canvas");
                glowCanvas.width = 256;
                glowCanvas.height = 256;
                const glowContext = glowCanvas.getContext("2d");
                const glow = glowContext.createRadialGradient(128, 128, 16, 128, 128, 128);
                glow.addColorStop(0, "rgba(255,244,204,0.68)");
                glow.addColorStop(0.18, "rgba(255,171,55,0.36)");
                glow.addColorStop(0.52, "rgba(255,100,24,0.12)");
                glow.addColorStop(1, "rgba(255,75,12,0)");
                glowContext.fillStyle = glow;
                glowContext.fillRect(0, 0, 256, 256);
                const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                    map: new THREE.CanvasTexture(glowCanvas),
                    color: visual.glowColor || 0xffa143,
                    transparent: true,
                    opacity: 0.65,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                }));
                glowSprite.name = "sun_glow";
                glowSprite.scale.set(visual.radius * 4.8, visual.radius * 4.8, 1);
                planetGroup.add(glowSprite);

                const prominences = new THREE.Group();
                prominences.name = "sun_prominences";
                [
                    { angle: 0.28, height: 2.8, width: 1.25 },
                    { angle: 2.05, height: 2.2, width: 1.0 },
                    { angle: 3.75, height: 2.6, width: 1.1 },
                    { angle: 5.3, height: 1.8, width: 0.9 }
                ].forEach(({ angle, height, width }) => {
                    const base = visual.radius * 0.97;
                    const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
                    const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
                    const points = [
                        radial.clone().multiplyScalar(base).addScaledVector(tangent, -width),
                        radial.clone().multiplyScalar(base + height * 0.55),
                        radial.clone().multiplyScalar(base + height).addScaledVector(tangent, width * 0.35),
                        radial.clone().multiplyScalar(base + height * 0.48).addScaledVector(tangent, width),
                        radial.clone().multiplyScalar(base).addScaledVector(tangent, width * 1.5)
                    ];
                    const curve = new THREE.CatmullRomCurve3(points);
                    const prominence = new THREE.Mesh(
                        new THREE.TubeGeometry(curve, 32, 0.12, 6, false),
                        new THREE.MeshBasicMaterial({
                            color: 0xffa33b,
                            transparent: true,
                            opacity: 0.72,
                            blending: THREE.AdditiveBlending,
                            depthWrite: false
                        })
                    );
                    prominence.rotation.y = (angle % 2) * 0.2;
                    prominences.add(prominence);
                });
                planetGroup.add(prominences);

                // Luz que ilumina planetas y órbitas cercanas.
                const sunLight = new THREE.PointLight(0xffe3b0, 3.5, 420);
                sunLight.name = "sun_light";
                planetGroup.add(sunLight);

                const coronaLight = new THREE.PointLight(0xff8a36, 0.8, 115);
                coronaLight.name = "sun_corona_light";
                planetGroup.add(coronaLight);

                interactiveObjects.push(sunMesh);
            } else {
                // Planetas texturizados con relieve procedural y materiales por tipo de mundo.
                const planetGeo = new THREE.SphereGeometry(visual.radius, 64, 48);
                
                const texture = createProceduralPlanetTexture(data.id, visual.color);
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                const planetMat = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: visual.roughness || 0.72,
                    metalness: 0.02
                });

                const planetMesh = new THREE.Mesh(planetGeo, planetMat);
                planetMesh.userData = { astroData: data };
                planetGroup.add(planetMesh);

                const atmosphereColors = {
                    venus: 0xf2bd75,
                    tierra: 0x56aaff,
                    marte: 0xff6945,
                    jupiter: 0xe7a46d,
                    saturno: 0xffe0aa,
                    urano: 0x70e7ee,
                    neptuno: 0x568bff
                };
                const atmosphereColor = visual.atmosphereColor || atmosphereColors[data.id];
                if (atmosphereColor) {
                    const atmosphereGeo = new THREE.SphereGeometry(visual.radius * 1.055, 48, 36);
                    const atmosphereMat = new THREE.MeshBasicMaterial({
                        color: atmosphereColor,
                        side: THREE.BackSide,
                        transparent: true,
                        opacity: data.id === "venus" ? 0.17 : 0.11,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });
                    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
                    atmosphere.name = "planet_atmosphere";
                    planetGroup.add(atmosphere);
                }

                if (visual.hasClouds || data.id === "venus") {
                    const cloudGeo = new THREE.SphereGeometry(visual.radius * 1.018, 48, 36);
                    const cloudMat = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        map: createCloudTexture(data.id),
                        transparent: true,
                        opacity: data.id === "venus" ? 0.5 : 0.68,
                        depthWrite: false,
                        roughness: 1
                    });
                    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
                    cloudMesh.name = "planet_clouds";
                    planetGroup.add(cloudMesh);
                }

                // Anillos con bandas y separaciones visibles.
                if (visual.hasRings) {
                    const ringBands = data.id === "saturno"
                        ? [
                            [1.3, 1.48, 0x9d8a70, 0.45],
                            [1.5, 1.78, 0xe2d1af, 0.88],
                            [1.8, 2.12, 0xb9a584, 0.58],
                            [2.16, 2.55, 0xe8d8ba, 0.82]
                        ]
                        : [[visual.ringInner / visual.radius, visual.ringOuter / visual.radius, visual.ringColor, 0.56]];

                    ringBands.forEach(([innerScale, outerScale, color, opacity]) => {
                        const ringGeo = new THREE.RingGeometry(
                            visual.radius * innerScale,
                            visual.radius * outerScale,
                            96
                        );
                        if (visual.ringTiltVertical) {
                            ringGeo.rotateY(Math.PI / 2);
                            ringGeo.rotateZ(0.2);
                        } else {
                            ringGeo.rotateX(Math.PI / 2 - 0.36);
                        }

                        const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
                            color,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity,
                            roughness: 0.88,
                            metalness: 0,
                            depthWrite: false
                        }));
                        ringMesh.name = "planet_ring";
                        planetGroup.add(ringMesh);
                    });
                }

                // Registro estricto para Raycaster
                interactiveObjects.push(planetMesh);
            }

            activeSectionGroup.add(planetGroup);

            // ================================================================
            // PUNTO DE EXTENSIÓN PARA MODELOS 3D EXTERNOS (GLTFLoader):
            // AQUÍ DEBES CARGAR EL MODELO 3D EXTERNO MEDIANTE GLTFLoader.
            // Sustituir el objeto provisional por el archivo .glb o .gltf correspondiente.
            // Ejemplo:
            // const loader = new THREE.GLTFLoader();
            // loader.load(`/models/${data.id}.glb`, (gltf) => {
            //     planetGroup.remove(planetMesh);
            //     planetGroup.add(gltf.scene);
            //     interactiveObjects.push(gltf.scene);
            // });
            // ================================================================
        });
    }

    /**
     * Construye figuras estelares esquemáticas; sus posiciones son ilustrativas.
     */
    function buildConstellations(constellationsData) {
        constellationsData.forEach((data) => {
            const visual = data.visual;
            const constelGroup = new THREE.Group();
            constelGroup.position.set(visual.center.x, visual.center.y, visual.center.z);
            constelGroup.userData = { astroData: data };

            // 1. Estrellas principales que componen la constelación
            const starMeshes = [];
            const starPositions = visual.stars.map((star, index) => [
                star.pos[0],
                star.pos[1],
                star.pos[2] + Math.sin((index + 1) * 1.7) * 5
            ]);
            visual.stars.forEach((star, index) => {
                const sGeo = new THREE.SphereGeometry(star.size * 0.8, 16, 16);
                const sMat = new THREE.MeshBasicMaterial({
                    color: star.color
                });
                const sMesh = new THREE.Mesh(sGeo, sMat);
                sMesh.position.set(...starPositions[index]);

                // Halo estelar individual
                const haloGeo = new THREE.SphereGeometry(star.size * 1.8, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: star.color,
                    transparent: true,
                    opacity: 0.35,
                    blending: THREE.AdditiveBlending
                });
                const haloMesh = new THREE.Mesh(haloGeo, haloMat);
                sMesh.add(haloMesh);

                constelGroup.add(sMesh);
                starMeshes.push(sMesh);
            });

            // 2. Líneas de conexión características de la constelación
            const linePositions = [];
            visual.lines.forEach(([startIdx, endIdx]) => {
                const p1 = starPositions[startIdx];
                const p2 = starPositions[endIdx];
                linePositions.push(p1[0], p1[1], p1[2]);
                linePositions.push(p2[0], p2[1], p2[2]);
            });

            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lineMat = new THREE.LineBasicMaterial({
                color: visual.color,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                linewidth: 2
            });
            const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
            constelGroup.add(linesMesh);

            // 3. Esfera volumétrica translúcida interactiva que engloba toda la constelación
            // Permite seleccionar la constelación haciendo clic sobre cualquier punto de ella
            const hitSphereGeo = new THREE.SphereGeometry(14, 16, 16);
            const hitSphereMat = new THREE.MeshBasicMaterial({
                color: visual.color,
                transparent: true,
                opacity: 0.05,
                wireframe: true
            });
            const hitSphere = new THREE.Mesh(hitSphereGeo, hitSphereMat);
            hitSphere.userData = { astroData: data };
            constelGroup.add(hitSphere);

            // Registrar objeto interactivo en el Raycaster
            interactiveObjects.push(hitSphere);

            // Añadir al grupo de sección
            activeSectionGroup.add(constelGroup);
        });
    }

    /**
     * Construye galaxias ilustrativas con morfologías diferenciadas.
     */
    function buildGalaxies(galaxiesData) {
        galaxiesData.forEach((data) => {
            const visual = data.visual;
            const galaxyGroup = new THREE.Group();
            galaxyGroup.position.set(visual.center.x, visual.center.y, visual.center.z);
            galaxyGroup.userData = { astroData: data };

            if (visual.tilt) {
                galaxyGroup.rotation.x = visual.tilt.x;
                galaxyGroup.rotation.y = visual.tilt.y;
                galaxyGroup.rotation.z = visual.tilt.z;
            } else {
                galaxyGroup.rotation.x = 0.55;
            }

            // 1. Sistema de Partículas Espiraladas de la Galaxia
            const pCount = visual.particleCount;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(pCount * 3);
            const colors = new Float32Array(pCount * 3);

            const coreCol = new THREE.Color(visual.coreColor);
            const armCol = new THREE.Color(visual.armColor);
            const random = createSeededRandom(data.id);
            const morphology = visual.morphology || "spiral";
            const armCount = Math.max(1, visual.arms || 2);
            const pitch = visual.pitchAngle || 19;
            const companionAngle = visual.companion
                ? Math.atan2(visual.companion.z, visual.companion.x)
                : 0;

            for (let i = 0; i < pCount; i++) {
                const i3 = i * 3;
                let r;
                let x;
                let y;
                let z;
                let radialMix;

                if (morphology === "elliptical") {
                    r = Math.pow(random(), 1.65) * visual.radius;
                    const angle = random() * Math.PI * 2;
                    x = Math.cos(angle) * r;
                    y = Math.sin(angle) * r * 0.68;
                    z = (random() - 0.5) * r * 0.52;
                    radialMix = Math.min(1, r / visual.radius);
                } else if (morphology === "edgeOn") {
                    r = Math.sqrt(random()) * visual.radius;
                    const angle = random() * Math.PI * 2;
                    x = Math.cos(angle) * r;
                    y = (random() - 0.5) * (visual.diskThickness || 0.28 + r * 0.018);
                    z = Math.sin(angle) * r * 0.48;
                    radialMix = Math.min(1, r / visual.radius);
                } else if (morphology === "cluster") {
                    r = Math.pow(random(), 0.72) * visual.radius;
                    const angle = random() * Math.PI * 2;
                    x = Math.cos(angle) * r;
                    z = Math.sin(angle) * r * 0.82;
                    y = (random() - 0.5) * visual.radius * 0.34;
                    radialMix = Math.min(1, r / visual.radius);
                } else {
                    const isBulgeStar = random() < (visual.bulgeFraction ?? 0.28);
                    r = Math.sqrt(random()) * visual.radius * (isBulgeStar ? 0.42 : 1);
                    const radiusFromCore = Math.max(0.12, r / visual.radius);
                    const inBar = morphology === "barred"
                        && r < visual.radius * 0.42
                        && random() < 0.5;

                    if (inBar) {
                        x = (random() - 0.5) * visual.radius * 0.68;
                        z = (random() - 0.5) * visual.radius * 0.09;
                    } else {
                        const inArm = random() < 0.74;
                        const armIndex = Math.floor(random() * armCount);
                        const pitchRadians = pitch * Math.PI / 180;
                        const spiralAngle = Math.log(radiusFromCore) / Math.tan(pitchRadians);
                        const baseArmAngle = armIndex * Math.PI * 2 / armCount + spiralAngle;
                        const tidalPull = (visual.interaction || 0)
                            * Math.pow(radiusFromCore, 1.8)
                            * Math.sin(baseArmAngle - companionAngle);
                        const armAngle = baseArmAngle + tidalPull;
                        const angle = inArm
                            ? armAngle + (random() - 0.5) * (0.12 + radiusFromCore * 0.16)
                            : random() * Math.PI * 2;
                        const armWidth = 0.35 + radiusFromCore * visual.radius * 0.055;
                        const spread = inArm ? armWidth : 0;
                        x = Math.cos(angle) * r + (random() - 0.5) * spread;
                        z = Math.sin(angle) * r + (random() - 0.5) * spread;
                    }

                    const bulge = Math.max(0, 1 - r / (visual.radius * 0.32));
                    y = (random() - 0.5) * (0.12 + radiusFromCore * 0.65) + (random() - 0.5) * bulge * 0.7;
                    radialMix = Math.min(1, r / visual.radius);
                }

                pos[i3] = x;
                pos[i3 + 1] = y;
                pos[i3 + 2] = z;

                const mixedColor = coreCol.clone().lerp(armCol, radialMix);
                if (morphology !== "elliptical" && random() > 0.92) {
                    mixedColor.lerp(new THREE.Color(0xf4f7ff), 0.55 + random() * 0.4);
                }
                colors[i3]     = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const mat = new THREE.PointsMaterial({
                size: morphology === "edgeOn" ? (visual.pointSize || 1.25) : 1.4,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });

            const galaxyPoints = new THREE.Points(geo, mat);
            galaxyGroup.add(galaxyPoints);

            if (visual.starFormingRegions) {
                const regionRandom = createSeededRandom(`${data.id}-star-forming-regions`);
                const starsPerRegion = 16;
                const regionPositions = new Float32Array(visual.starFormingRegions * starsPerRegion * 3);
                for (let region = 0; region < visual.starFormingRegions; region++) {
                    const armIndex = Math.floor(regionRandom() * armCount);
                    const radiusFromCore = 0.3 + regionRandom() * 0.62;
                    const radius = radiusFromCore * visual.radius;
                    const pitchRadians = pitch * Math.PI / 180;
                    const angle = armIndex * Math.PI * 2 / armCount
                        + Math.log(radiusFromCore) / Math.tan(pitchRadians);
                    const centerX = morphology === "edgeOn"
                        ? (regionRandom() - 0.5) * visual.radius * 0.65
                        : Math.cos(angle) * radius;
                    const centerZ = morphology === "edgeOn"
                        ? (regionRandom() - 0.5) * visual.radius * 0.24
                        : Math.sin(angle) * radius;

                    for (let star = 0; star < starsPerRegion; star++) {
                        const i3 = (region * starsPerRegion + star) * 3;
                        const spread = 0.25 + regionRandom() * 0.7;
                        regionPositions[i3] = centerX + (regionRandom() - 0.5) * spread;
                        regionPositions[i3 + 1] = (regionRandom() - 0.5) * 0.35;
                        regionPositions[i3 + 2] = centerZ + (regionRandom() - 0.5) * spread;
                    }
                }
                const regionGeometry = new THREE.BufferGeometry();
                regionGeometry.setAttribute("position", new THREE.BufferAttribute(regionPositions, 3));
                galaxyGroup.add(new THREE.Points(
                    regionGeometry,
                    new THREE.PointsMaterial({
                    color: visual.starFormingColor || 0xb9dcff,
                        size: 1.8,
                        transparent: true,
                        opacity: 0.8,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        sizeAttenuation: true
                    })
                ));
            }

            // 2. Bulbo central y polvo oscuro en galaxias vistas de canto.
            const coreScale = morphology === "cluster"
                ? 0.045
                : morphology === "elliptical" ? 0.31 : morphology === "edgeOn" ? 0.24 : 0.17;
            const coreGeo = new THREE.SphereGeometry(visual.radius * coreScale, 40, 28);
            const coreMat = new THREE.MeshBasicMaterial({
                color: visual.coreColor,
                transparent: true,
                opacity: morphology === "cluster" ? 0.4 : 0.72,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const coreMesh = new THREE.Mesh(coreGeo, coreMat);
            coreMesh.scale.set(
                morphology === "cluster" ? 1 : morphology === "barred" ? 1.8 : morphology === "elliptical" ? 1.2 : 1.15,
                morphology === "cluster" ? 1 : morphology === "edgeOn" ? 0.5 : morphology === "barred" ? 0.48 : 0.72,
                morphology === "cluster" ? 1 : morphology === "edgeOn" ? 0.75 : morphology === "barred" ? 0.68 : 0.92
            );
            galaxyGroup.add(coreMesh);

            if (visual.morphology === "edgeOn") {
                const dustGeo = new THREE.BoxGeometry(visual.radius * 1.82, 0.24, visual.radius * 0.08);
                const dustMat = new THREE.MeshBasicMaterial({
                    color: 0x17121b,
                    transparent: true,
                    opacity: 0.78,
                    depthWrite: false
                });
                const dustLane = new THREE.Mesh(dustGeo, dustMat);
                dustLane.position.y = -0.02;
                galaxyGroup.add(dustLane);
            }

            if (visual.globularClusters) {
                const clusterRandom = createSeededRandom(`${data.id}-globular-clusters`);
                const clusterPositions = new Float32Array(visual.globularClusters * 3);
                for (let i = 0; i < visual.globularClusters; i++) {
                    const i3 = i * 3;
                    const angle = clusterRandom() * Math.PI * 2;
                    const distance = visual.radius * (1.05 + clusterRandom() * 0.55);
                    clusterPositions[i3] = Math.cos(angle) * distance;
                    clusterPositions[i3 + 1] = (clusterRandom() - 0.5) * distance * 0.32;
                    clusterPositions[i3 + 2] = Math.sin(angle) * distance * 0.72;
                }
                const clusterGeometry = new THREE.BufferGeometry();
                clusterGeometry.setAttribute("position", new THREE.BufferAttribute(clusterPositions, 3));
                galaxyGroup.add(new THREE.Points(
                    clusterGeometry,
                    new THREE.PointsMaterial({
                        color: 0xffdfb0,
                        size: 1.05,
                        transparent: true,
                        opacity: 0.72,
                        depthWrite: false,
                        sizeAttenuation: true
                    })
                ));
            }

            if (visual.companion) {
                const companion = new THREE.Group();
                companion.position.set(visual.companion.x, visual.companion.y, visual.companion.z);
                const companionPoints = new THREE.Points(
                    createGalaxyParticleGeometry(
                        Math.max(420, Math.floor(pCount * 0.16)),
                        visual.companion.radius,
                        visual.companion.color,
                        visual.armColor,
                        `${data.id}-companion`
                    ),
                    new THREE.PointsMaterial({
                        size: 1.0,
                        transparent: true,
                        vertexColors: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    })
                );
                companion.add(companionPoints);
                companion.add(new THREE.Mesh(
                    new THREE.SphereGeometry(visual.companion.radius * 0.16, 20, 16),
                    new THREE.MeshBasicMaterial({
                        color: visual.companion.color,
                        transparent: true,
                        opacity: 0.72,
                        blending: THREE.AdditiveBlending
                    })
                ));
                galaxyGroup.add(companion);
            }

            if (visual.jet) {
                [-1, 1].forEach((direction) => {
                    const jet = new THREE.Mesh(
                        new THREE.ConeGeometry(
                            visual.radius * (visual.jetWidth || 0.045),
                            visual.radius * (visual.jetLength || 1.4),
                            12,
                            1,
                            true
                        ),
                        new THREE.MeshBasicMaterial({
                            color: visual.jetColor || 0x79bfff,
                            transparent: true,
                            opacity: visual.jetOpacity || 0.35,
                            side: THREE.DoubleSide,
                            blending: THREE.AdditiveBlending,
                            depthWrite: false
                        })
                    );
                    jet.position.y = direction * visual.radius * 0.82;
                    jet.rotation.x = direction > 0 ? 0 : Math.PI;
                    galaxyGroup.add(jet);
                });
            }

            // 3. Marcador especial de la Vía Láctea: Posición de nuestro Sistema Solar
            if (visual.showSolarMarker) {
                const solarBeaconGeo = new THREE.SphereGeometry(0.5, 16, 16);
                const solarBeaconMat = new THREE.MeshBasicMaterial({
                    color: 0xffee00
                });
                const solarBeacon = new THREE.Mesh(solarBeaconGeo, solarBeaconMat);
                // Ubicación aproximada: a unos 2/3 del núcleo en el plano del disco
                solarBeacon.position.set(visual.radius * 0.46, 0.16, visual.radius * 0.18);
                solarBeacon.name = "solar_system_beacon";

                // Anillo de pulso sobre el marcador
                const pulseGeo = new THREE.RingGeometry(0.7, 1.2, 32);
                pulseGeo.rotateX(Math.PI / 2);
                const pulseMat = new THREE.MeshBasicMaterial({
                    color: 0x38bdf8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.75,
                    blending: THREE.AdditiveBlending
                });
                const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
                pulseRing.name = "solar_beacon_pulse";
                solarBeacon.add(pulseRing);

                galaxyGroup.add(solarBeacon);
            }

            // 4. Hitbox volumétrica para el Raycaster
            const hitGeo = new THREE.SphereGeometry(visual.radius * 1.1, 16, 16);
            const hitMat = new THREE.MeshBasicMaterial({
                color: visual.armColor,
                transparent: true,
                opacity: 0.04,
                wireframe: true
            });
            const hitMesh = new THREE.Mesh(hitGeo, hitMat);
            hitMesh.userData = { astroData: data };
            galaxyGroup.add(hitMesh);

            interactiveObjects.push(hitMesh);
            activeSectionGroup.add(galaxyGroup);
        });
    }

    function createGalaxyParticleGeometry(count, radius, coreHex, armHex, seed) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const coreColor = new THREE.Color(coreHex);
        const armColor = new THREE.Color(armHex);
        const random = createSeededRandom(seed);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const distance = Math.sqrt(random()) * radius;
            const angle = random() * Math.PI * 2;
            positions[i3] = Math.cos(angle) * distance;
            positions[i3 + 1] = (random() - 0.5) * distance * 0.35;
            positions[i3 + 2] = Math.sin(angle) * distance;
            const color = coreColor.clone().lerp(armColor, distance / radius);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return geometry;
    }

    /**
     * ========================================================================
     * INTERACCIÓN POR RAYCASTER (REQUISITO SECCIÓN 5.3)
     * Detecta clics sobre interactiveObjects únicamente.
     * ========================================================================
     */
    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize, false);

        canvasElement.addEventListener('pointerdown', (e) => {
            isMouseDown = true;
            mouseDownPos.x = e.clientX;
            mouseDownPos.y = e.clientY;
        });

        canvasElement.addEventListener('pointerup', (e) => {
            isMouseDown = false;
            // Distinguir entre un arrastre de cámara y un clic genuino
            const deltaX = Math.abs(e.clientX - mouseDownPos.x);
            const deltaY = Math.abs(e.clientY - mouseDownPos.y);

            if (deltaX < 5 && deltaY < 5) {
                handlePointerClick(e);
            }
        });

        // Hover para cambio dinámico de cursor sobre objetos interactivos
        canvasElement.addEventListener('pointermove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            if (isMouseDown) return;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(interactiveObjects, true);

            if (intersects.length > 0) {
                canvasElement.style.cursor = 'pointer';
            } else {
                canvasElement.style.cursor = 'grab';
            }
        });
    }

    function handlePointerClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects, true);

        if (intersects.length > 0) {
            // Encontrar el objeto con metadatos de astro
            let target = intersects[0].object;
            while (target && !target.userData?.astroData && target.parent) {
                target = target.parent;
            }

            if (target && target.userData && target.userData.astroData) {
                focusObject(target.userData.astroData);
            }
        }
    }

    /**
     * ========================================================================
     * MOVIMIENTO SUAVE DE CÁMARA (LERP) HACIA EL ASTRO SELECCIONADO
     * ========================================================================
     */
    function focusObject(astroData) {
        selectedObjectData = astroData;

        // Calcular posición destino en coordenadas de mundo
        let worldPos = new THREE.Vector3();
        if (astroData.visual.position) {
            worldPos.set(astroData.visual.position.x, astroData.visual.position.y, astroData.visual.position.z);
        } else if (astroData.visual.center) {
            worldPos.set(astroData.visual.center.x, astroData.visual.center.y, astroData.visual.center.z);
        }

        const offset = astroData.cameraFocusOffset || { x: 0, y: 3, z: 12 };

        targetLookAt.copy(worldPos);
        targetCameraPos.set(worldPos.x + offset.x, worldPos.y + offset.y, worldPos.z + offset.z);
        isLerpingCamera = true;

        if (controls) {
            controls.enabled = false; // Desactivar temporalmente durante interpolación
        }

        // Notificar a los suscriptores externos (HUD e IA)
        if (onObjectSelectCallback) {
            onObjectSelectCallback(astroData);
        }
        objectLabels.forEach(({ astroData: labelData, button }) => {
            const isSelected = labelData.id === astroData.id;
            button.classList.toggle("active", isSelected);
            button.setAttribute("aria-pressed", isSelected ? "true" : "false");
        });
    }

    /**
     * Restablece la cámara a la vista general de la sección activa.
     */
    function resetCamera() {
        const catalog = window.AstronomyCatalog || (typeof AstronomyCatalog !== 'undefined' ? AstronomyCatalog : null);
        const sectionConfig = catalog ? catalog[currentSectionKey] : null;
        const defCam = sectionConfig ? sectionConfig.defaultCamera : { x: 0, y: 45, z: 120 };

        targetLookAt.set(0, 0, 0);
        targetCameraPos.set(defCam.x, defCam.y, defCam.z);
        isLerpingCamera = true;

        if (controls) {
            controls.enabled = false;
        }

        selectedObjectData = null;
        objectLabels.forEach(({ button }) => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        if (onGeneralViewCallback) {
            onGeneralViewCallback(currentSectionKey);
        }
    }

    /**
     * Ajuste responsive del viewport y cámara.
     */
    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * ========================================================================
     * BUCLE PRINCIPAL DE ANIMACIÓN Y RENDERIZADO (RENDER LOOP)
     * ========================================================================
     */
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // 1. Animación suave del fondo estelar decorativo (rotación galáctica sutil)
        if (starField) {
            starField.rotation.y = elapsedTime * 0.003;
            starField.rotation.x = Math.sin(elapsedTime * 0.002) * 0.02;
        }

        // 2. Animación de los objetos astronómicos según su naturaleza
        if (activeSectionGroup) {
            activeSectionGroup.children.forEach((child) => {
                // Rotación axial de planetas
                if (child.isGroup && child.userData?.astroData) {
                    const data = child.userData.astroData;
                    if (data.visual.type === "sun") {
                        child.rotation.y += 0.0015;
                        const innerCorona = child.getObjectByName("sun_inner_corona");
                        const outerCorona = child.getObjectByName("sun_outer_corona");
                        const glow = child.getObjectByName("sun_glow");
                        const coronaLight = child.getObjectByName("sun_corona_light");
                        const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * 1.8);

                        if (innerCorona) innerCorona.rotation.y = -elapsedTime * 0.018;
                        if (outerCorona) outerCorona.rotation.y = elapsedTime * 0.012;
                        if (glow) glow.material.opacity = 0.58 + pulse * 0.12;
                        if (coronaLight) coronaLight.intensity = 0.65 + pulse * 0.25;
                    } else if (data.visual.type === "planet") {
                        child.rotation.y += 0.008;
                    }

                    // Rotación independiente de la capa de nubes de la Tierra
                    const clouds = child.getObjectByName("planet_clouds");
                    if (clouds) {
                        clouds.rotation.y += 0.004;
                    }
                }

                // Rotación dinámica de brazos galácticos
                if (child.isGroup && child.userData?.astroData?.visual?.type === "galaxy") {
                    child.rotation.z += 0.002;

                    // Pulso del marcador solar
                    const pulseRing = child.getObjectByName("solar_beacon_pulse");
                    if (pulseRing) {
                        const s = 1.0 + Math.sin(elapsedTime * 4.0) * 0.25;
                        pulseRing.scale.set(s, s, s);
                    }
                }
            });
        }

        // 3. Interpolación suave de cámara (Lerp)
        if (isLerpingCamera) {
            camera.position.lerp(targetCameraPos, 0.055);
            currentLookAt.lerp(targetLookAt, 0.055);

            if (controls) {
                controls.target.copy(currentLookAt);
                controls.update();
            } else {
                camera.lookAt(currentLookAt);
            }

            // Comprobar llegada con umbral de tolerancia
            if (camera.position.distanceTo(targetCameraPos) < 0.1 && currentLookAt.distanceTo(targetLookAt) < 0.1) {
                camera.position.copy(targetCameraPos);
                currentLookAt.copy(targetLookAt);
                isLerpingCamera = false;
                if (controls) {
                    controls.enabled = true;
                }
            }
        } else if (controls) {
            controls.update();
        }

        updateObjectLabels();
        renderer.render(scene, camera);
    }

    function createSolarTexture() {
        const width = 1024;
        const height = 512;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const random = createSeededRandom("sun-photosphere");
        const surface = ctx.createLinearGradient(0, 0, 0, height);
        surface.addColorStop(0, "#ffbd55");
        surface.addColorStop(0.22, "#ff8a24");
        surface.addColorStop(0.5, "#ffcf63");
        surface.addColorStop(0.78, "#f97a1d");
        surface.addColorStop(1, "#ffb347");
        ctx.fillStyle = surface;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 950; i++) {
            const x = random() * width;
            const y = random() * height;
            const radius = 4 + random() * 18;
            const granule = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const bright = random() > 0.48;
            granule.addColorStop(0, bright ? "rgba(255,244,173,0.42)" : "rgba(166,49,10,0.24)");
            granule.addColorStop(0.7, bright ? "rgba(255,191,73,0.16)" : "rgba(198,61,13,0.1)");
            granule.addColorStop(1, "rgba(255,160,40,0)");
            ctx.fillStyle = granule;
            ctx.beginPath();
            ctx.ellipse(x, y, radius * (1.2 + random() * 0.7), radius * (0.65 + random() * 0.45), random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < 7; i++) {
            const x = random() * width;
            const y = 55 + random() * (height - 110);
            const radiusX = 12 + random() * 24;
            const radiusY = 5 + random() * 9;
            const spot = ctx.createRadialGradient(x, y, 1, x, y, radiusX);
            spot.addColorStop(0, "rgba(115,38,12,0.78)");
            spot.addColorStop(0.45, "rgba(174,56,15,0.68)");
            spot.addColorStop(1, "rgba(189,67,18,0)");
            ctx.fillStyle = spot;
            ctx.beginPath();
            ctx.ellipse(x, y, radiusX, radiusY, random() * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        return texture;
    }

    /**
     * Textura esférica procedural de aspecto ilustrativo; no representa datos topográficos.
     */
    function createProceduralPlanetTexture(planetId, baseHex) {
        const width = 1024;
        const height = 512;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const random = createSeededRandom(planetId);
        const baseColor = new THREE.Color(baseHex);
        const color = `#${baseColor.getHexString()}`;
        const vertical = ctx.createLinearGradient(0, 0, 0, height);
        vertical.addColorStop(0, shadeHex(baseHex, 1.24));
        vertical.addColorStop(0.5, color);
        vertical.addColorStop(1, shadeHex(baseHex, 0.68));
        ctx.fillStyle = vertical;
        ctx.fillRect(0, 0, width, height);

        if (planetId === "tierra") {
            ctx.fillStyle = "#123b78";
            ctx.fillRect(0, 0, width, height);
            const continents = [
                [[70, 95], [110, 75], [160, 92], [182, 128], [164, 170], [149, 215], [126, 238], [111, 190], [88, 160]],
                [[165, 230], [202, 242], [207, 284], [194, 337], [177, 386], [159, 345], [155, 294]],
                [[260, 100], [314, 75], [370, 89], [414, 120], [405, 160], [367, 168], [351, 202], [314, 190], [282, 158]],
                [[340, 199], [380, 207], [397, 245], [382, 300], [365, 351], [338, 320], [322, 267]],
                [[475, 95], [515, 78], [557, 90], [579, 119], [560, 148], [527, 141], [501, 165], [476, 138]],
                [[785, 100], [828, 86], [866, 112], [858, 153], [829, 174], [802, 147]],
                [[835, 218], [868, 225], [880, 264], [858, 311], [834, 282]]
            ];
            continents.forEach((points, index) => {
                ctx.beginPath();
                points.forEach(([x, y], i) => {
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.closePath();
                ctx.fillStyle = index < 4 ? "#5b914d" : "#6f9c59";
                ctx.fill();
                ctx.strokeStyle = "rgba(179, 187, 116, 0.38)";
                ctx.lineWidth = 5;
                ctx.stroke();
            });
            ctx.fillStyle = "rgba(226, 239, 226, 0.82)";
            ctx.fillRect(0, 0, width, 15);
            ctx.fillRect(0, height - 15, width, 15);
        } else if (["jupiter", "saturno", "urano", "neptuno"].includes(planetId)) {
            const bands = planetId === "jupiter" ? 30 : planetId === "saturno" ? 24 : 16;
            const bandPalette = planetId === "jupiter"
                ? ["rgba(105,54,38,.22)", "rgba(255,224,184,.32)", "rgba(143,83,56,.3)", "rgba(250,220,178,.18)"]
                : planetId === "saturno"
                    ? ["rgba(140,106,65,.2)", "rgba(255,245,219,.28)", "rgba(182,144,93,.22)"]
                    : ["rgba(210,255,255,.2)", "rgba(19,80,113,.12)", "rgba(255,255,255,.15)"];
            for (let i = 0; i < bands; i++) {
                const y = (i / bands) * height;
                const bandHeight = height / bands * (0.25 + random() * 0.65);
                ctx.fillStyle = bandPalette[i % bandPalette.length];
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x <= width; x += 64) {
                    ctx.lineTo(x, y + Math.sin(x * 0.012 + i) * 5 + Math.sin(x * 0.03) * 2);
                }
                for (let x = width; x >= 0; x -= 64) {
                    ctx.lineTo(x, y + bandHeight + Math.sin(x * 0.01 + i) * 6);
                }
                ctx.closePath();
                ctx.fill();
            }

            if (planetId === "jupiter") {
                const storm = ctx.createRadialGradient(660, 315, 4, 660, 315, 40);
                storm.addColorStop(0, "#d88958");
                storm.addColorStop(0.65, "#b85739");
                storm.addColorStop(1, "rgba(160,70,42,0)");
                ctx.fillStyle = storm;
                ctx.beginPath();
                ctx.ellipse(660, 315, 46, 22, -0.08, 0, Math.PI * 2);
                ctx.fill();
            } else if (planetId === "neptuno") {
                ctx.fillStyle = "rgba(12, 34, 125, .6)";
                ctx.beginPath();
                ctx.ellipse(700, 260, 36, 15, -0.15, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            const craterCount = planetId === "mercurio" ? 230 : 100;
            for (let i = 0; i < craterCount; i++) {
                const x = random() * width;
                const y = 25 + random() * (height - 50);
                const radius = 2 + random() * (planetId === "mercurio" ? 15 : 10);
                const crater = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.25, 1, x, y, radius);
                crater.addColorStop(0, "rgba(255,239,210,.08)");
                crater.addColorStop(0.72, "rgba(65,39,32,.12)");
                crater.addColorStop(1, "rgba(28,21,20,.32)");
                ctx.fillStyle = crater;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "rgba(255,229,199,.13)";
                ctx.lineWidth = Math.max(1, radius * 0.12);
                ctx.stroke();
            }

            if (planetId === "marte") {
                ctx.fillStyle = "rgba(245, 220, 184, .55)";
                ctx.fillRect(0, 0, width, 12);
                ctx.fillRect(0, height - 12, width, 12);
                ctx.fillStyle = "rgba(92, 40, 29, .23)";
                for (let i = 0; i < 24; i++) {
                    const x = random() * width;
                    const y = random() * height;
                    ctx.beginPath();
                    ctx.ellipse(x, y, 18 + random() * 48, 4 + random() * 9, random(), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
    }

    function createCloudTexture(planetId) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        const random = createSeededRandom(`${planetId}-clouds`);

        for (let i = 0; i < 180; i++) {
            const x = random() * canvas.width;
            const y = 20 + random() * (canvas.height - 40);
            const width = planetId === "venus" ? 24 + random() * 100 : 18 + random() * 76;
            const height = planetId === "venus" ? 3 + random() * 15 : 2 + random() * 12;
            const cloud = ctx.createRadialGradient(x, y, 1, x, y, width);
            cloud.addColorStop(0, `rgba(255,255,255,${planetId === "venus" ? 0.5 : 0.38})`);
            cloud.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = cloud;
            ctx.beginPath();
            ctx.ellipse(x, y, width, height, (random() - 0.5) * 0.12, 0, Math.PI * 2);
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    }

    function createSeededRandom(seed) {
        let value = 0;
        for (let i = 0; i < seed.length; i++) {
            value = (value * 31 + seed.charCodeAt(i)) >>> 0;
        }
        return () => {
            value = (value + 0x6D2B79F5) >>> 0;
            let t = value;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function shadeHex(hex, factor) {
        const color = new THREE.Color(hex);
        color.multiplyScalar(factor);
        return `#${color.getHexString()}`;
    }

    /**
     * Limpieza recursiva de geometrías y materiales para prevenir fugas de memoria en WebGL
     */
    function disposeGroup(group) {
        while (group.children.length > 0) {
            const obj = group.children[0];
            group.remove(obj);

            obj.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => {
                            if (mat.map) mat.map.dispose();
                            mat.dispose();
                        });
                    } else {
                        if (child.material.map) child.material.map.dispose();
                        child.material.dispose();
                    }
                }
            });
        }
    }

    return {
        init,
        loadSection,
        focusObject,
        resetCamera,
        getSelectedObject: () => selectedObjectData,
        getCurrentSection: () => currentSectionKey
    };
})();

// Exportación global para entorno navegador
if (typeof window !== "undefined") {
    window.SpaceScene = SpaceScene;
}
