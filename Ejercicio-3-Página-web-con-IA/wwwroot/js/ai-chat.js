/**
 * ============================================================================
 * ASTRONOMÍA 3D - INTERFAZ DE COMPUTADORA DE A BORDO & TELEMETRÍA (IA)
 * Gestión del panel HUD Glassmorphism, preguntas rápidas, llamadas Fetch API
 * y animación progresiva tipo máquina de escribir con textContent seguro.
 * ============================================================================
 */

const AiChatManager = (() => {
    // Referencias a elementos del DOM
    let hudPanel, categoryBadge, astroNameEl, astroSubtitleEl, astroDescriptionEl;
    let chatMessagesContainer, chatLoadingIndicator;
    let quickPromptsContainer, chatForm, chatInput, btnSendChat, btnCloseHud;

    // Estado local
    let currentAstro = null;
    let isProcessing = false;
    let typewriterIntervalId = null;

    /**
     * Inicializa los selectores del DOM y los escuchadores de eventos.
     */
    function init() {
        hudPanel = document.getElementById("hud-panel");
        categoryBadge = document.getElementById("hud-category-badge");
        astroNameEl = document.getElementById("hud-astro-name");
        astroSubtitleEl = document.getElementById("hud-astro-subtitle");
        astroDescriptionEl = document.getElementById("hud-astro-description");

        chatMessagesContainer = document.getElementById("chat-messages");
        chatLoadingIndicator = document.getElementById("chat-loading-indicator");
        quickPromptsContainer = document.getElementById("quick-prompts-container");

        chatForm = document.getElementById("chat-form");
        chatInput = document.getElementById("chat-input");
        btnSendChat = document.getElementById("btn-send-chat");
        btnCloseHud = document.getElementById("btn-close-hud");

        setupEvents();
    }

    /**
     * Configuración de eventos de la interfaz HUD y chat.
     */
    function setupEvents() {
        // Cierre del HUD
        if (btnCloseHud) {
            btnCloseHud.addEventListener("click", () => {
                closeHud();
                if (window.SpaceScene) {
                    window.SpaceScene.resetCamera();
                }
            });
        }

        // Envío de pregunta desde el formulario
        if (chatForm) {
            chatForm.addEventListener("submit", (e) => {
                e.preventDefault();
                handleSendUserQuestion();
            });
        }

        if (btnSendChat) {
            btnSendChat.addEventListener("click", (e) => {
                e.preventDefault();
                handleSendUserQuestion();
            });
        }
    }

    /**
     * Abre el HUD con los datos del astro seleccionado y actualiza la IA.
     */
    function openAstroHud(astroData) {
        if (!astroData) return;
        currentAstro = astroData;

        // 1. Actualizar Ficha de Telemetría
        if (categoryBadge) categoryBadge.textContent = astroData.category.toUpperCase();
        if (astroNameEl) astroNameEl.textContent = astroData.name.toUpperCase();
        if (astroSubtitleEl) astroSubtitleEl.textContent = astroData.subtitle || "CUERPO CELESTE REGISTRADO";
        if (astroDescriptionEl) astroDescriptionEl.textContent = astroData.description;

        // 2. Actualizar las Tres Preguntas Rápidas Dinámicas
        renderQuickPrompts(astroData.quickPrompts || []);

        // 3. Reiniciar la conversación de manera coherente con saludo contextual
        resetChatMessages(astroData);

        // 4. Mostrar el panel HUD con transición Glassmorphism
        if (hudPanel) {
            hudPanel.classList.remove("hidden");
        }
    }

    /**
     * Cierra el panel HUD.
     */
    function closeHud() {
        if (hudPanel) {
            hudPanel.classList.add("hidden");
        }
        currentAstro = null;
        stopTypewriter();
    }

    /**
     * Renderiza las 3 preguntas rápidas dinámicas específicas del astro.
     */
    function renderQuickPrompts(prompts) {
        if (!quickPromptsContainer) return;
        quickPromptsContainer.innerHTML = "";

        prompts.forEach((promptText) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quick-prompt-btn";
            btn.textContent = promptText;
            btn.addEventListener("click", () => {
                if (!isProcessing) {
                    sendQuestionToAi(promptText);
                }
            });
            quickPromptsContainer.appendChild(btn);
        });
    }

    /**
     * Reinicia el historial del chat mostrando el saludo inicial de la nave.
     */
    function resetChatMessages(astroData) {
        if (!chatMessagesContainer) return;
        chatMessagesContainer.innerHTML = "";

        const welcomeBubble = document.createElement("div");
        welcomeBubble.className = "message-bubble system";

        const senderSpan = document.createElement("span");
        senderSpan.className = "msg-sender";
        senderSpan.textContent = "COMPUTADORA DE A BORDO:";

        const pContent = document.createElement("p");
        pContent.className = "msg-content";
        pContent.textContent = `Telemetría enfocada en ${astroData.name}. Sensores espectrométricos en línea. Formula tus preguntas o selecciona una consulta rápida recomendada.`;

        welcomeBubble.appendChild(senderSpan);
        welcomeBubble.appendChild(pContent);
        chatMessagesContainer.appendChild(welcomeBubble);

        scrollChatToBottom();
    }

    /**
     * Maneja el envío de preguntas escritas por el explorador en el campo de texto.
     */
    function handleSendUserQuestion() {
        if (isProcessing || !currentAstro || !chatInput) return;
        const text = chatInput.value.trim();
        if (text.length === 0) return;

        chatInput.value = "";
        sendQuestionToAi(text);
    }

    /**
     * Envía la pregunta a la API del Backend C# (/api/ai/ask) vía Fetch API.
     */
    function buildLocalAstronomyAnswer(astroName, questionText) {
        const q = String(questionText || "").toLowerCase();
        const name = astroName || "objeto celeste";

        if (q.includes("ignora") || q.includes("olvida") || q.includes("jailbreak") || q.includes("chatgpt") || q.includes("pizza") || q.includes("fútbol") || q.includes("bitcoin")) {
            return "Solicitud rechazada, explorador. Mis protocolos están restringidos a la astronomía y la exploración espacial. Reformula tu consulta dentro de la misión.";
        }

        if (name === "Tierra") {
            if (q.includes("vida") || q.includes("posible")) {
                return "Telemetría planetaria recibida, explorador. La Tierra es el único oasis biológico conocido gracias a su ubicación en la zona de habitabilidad, agua líquida superficial y una atmósfera rica en nitrógeno y oxígeno. La biosfera interactúa en equilibrio perfecto con los ciclos geológicos.";
            }
            if (q.includes("magnético") || q.includes("campo")) {
                return "Análisis de magnetosfera completado, explorador. El campo magnético terrestre se genera por el efecto dinamo del núcleo externo de hierro y níquel fundido en rotación. Esta barrera invisible desvía los letales vientos solares protegiendo la vida.";
            }
            if (q.includes("atmósfera") || q.includes("profunda")) {
                return "Datos atmosféricos registrados, explorador. La atmósfera se extiende por más de 10.000 km hasta la exosfera, aunque el 75 % de su masa se concentra en los primeros 11 km de la troposfera. Esta delgada capa azul permite la respiración y modula el clima global.";
            }
            return "Parámetros del planeta Tierra confirmados, explorador. El planeta azul cuenta con una luna masiva que estabiliza la inclinación de su eje axial a 23,5 grados.";
        }

        if (name === "Marte") {
            if (q.includes("calor") || q.includes("temperatura")) {
                return "Negativo, explorador. Marte presenta una temperatura promedio cercana a los -60 °C y descensos extremos de hasta -125 °C en los polos. Recomiendo activar los sistemas de calefacción térmica de la nave.";
            }
            if (q.includes("agua")) {
                return "Escaneo hidrológico completado, explorador. Existe abundante agua en Marte en forma de hielo en sus casquetes polares y capas subterráneas congeladas. En el pasado remoto, la atmósfera permitió ríos y lagos de agua líquida.";
            }
            if (q.includes("rojizo") || q.includes("color")) {
                return "Espectrometría mineralógica completada, explorador. El tono carmesí de Marte se debe a la abundancia de óxido de hierro que cubre su superficie. El polvo esférico fino es levantado periódicamente por tormentas globales.";
            }
            return "Coordenadas marcianas fijadas, explorador. El Monte Olimpo, el volcán escudo más grande del sistema solar, domina la geografía del planeta rojo.";
        }

        if (name === "Júpiter" || name === "Jupiter") {
            if (q.includes("mancha roja") || q.includes("gran mancha")) {
                return "Análisis completado, explorador. La Gran Mancha Roja es un colosal vórtice anticiclónico que lleva activo al menos varios siglos. Su tamaño podría albergar al planeta Tierra en su interior.";
            }
            if (q.includes("lunas") || q.includes("luna")) {
                return "Censo orbital actualizado, explorador. Júpiter cuenta con 95 lunas reconocidas, encabezadas por Ío, Europa, Ganimedes y Calisto. Europa tiene un océano subsuperficial muy prometedor.";
            }
            return "Telemetría joviana activa, explorador. Júpiter posee una masa 2,5 veces superior a la de todos los demás planetas juntos y un campo magnético colosal.";
        }

        if (name === "Orión") {
            if (q.includes("estrella") || q.includes("principal")) {
                return "Sistemas de orientación estelar activos, explorador. Las estrellas más reconocibles de Orión son Betelgeuse, Rigel, Bellatrix y Saiph; su cinturón lo forman Alnitak, Alnilam y Mintaka.";
            }
            if (q.includes("nebulosa") || q.includes("m42")) {
                return "Telemetría infrarroja activa, explorador. La nebulosa de Orión (M42) está en la espada, debajo del cinturón, a unos 1.350 años luz. Es una región donde nacen estrellas.";
            }
            if (q.includes("distancia") || q.includes("lejos")) {
                return "Cálculo de distancias completado, explorador. Las estrellas de Orión están a distancias muy diferentes; por ejemplo, Rigel está a más de 800 años luz. La constelación es una figura aparente y no un grupo plano.";
            }
            return "Constelación de Orión fijada en el visor, explorador. Es reconocible por el cinturón de tres estrellas y por Betelgeuse y Rigel, que marcan dos de sus esquinas.";
        }

        if (name === "Osa Mayor") {
            if (q.includes("estrella") || q.includes("forman")) {
                return "Sistemas de navegación estelar activos, explorador. El Carro de la Osa Mayor lo forman Dubhe, Merak, Phecda, Megrez, Alioth, Mizar y Alkaid. Mizar tiene una compañera visible con prismáticos, Alcor.";
            }
            if (q.includes("localizar") || q.includes("encontrar")) {
                return "Guía de orientación espacial cargada, explorador. Busca el asterismo del Carro en el cielo norte; las estrellas Merak y Dubhe apuntan hacia Polaris al prolongar la línea que las une.";
            }
            if (q.includes("polar")) {
                return "Cálculo de rumbo efectuado, explorador. Prolonga unas cinco veces la distancia entre Merak y Dubhe para encontrar Polaris, en la Osa Menor. Estas estrellas sirven como referencia para orientarse en el hemisferio norte.";
            }
            return "Observación de la Osa Mayor completada, explorador. Es una constelación boreal conocida por el asterismo del Carro y sus siete estrellas brillantes.";
        }

        if (name === "Casiopea") {
            if (q.includes("estrella") || q.includes("forman") || q.includes("w")) {
                return "Mapa estelar de Casiopea actualizado, explorador. Sus cinco estrellas más reconocibles son Caph, Schedar, Gamma Cassiopeiae, Ruchbah y Segin; juntas dibujan una W o una M según su posición en el cielo.";
            }
            if (q.includes("dónde") || q.includes("donde") || q.includes("localizar") || q.includes("cielo")) {
                return "Coordenadas celestes fijadas, explorador. Casiopea está en el hemisferio norte, cerca del polo norte celeste y en el lado opuesto de la Osa Mayor respecto a Polaris; en muchas latitudes septentrionales puede verse todo el año.";
            }
            if (q.includes("qué es") || q.includes("que es")) {
                return "Análisis estelar completado, explorador. Una constelación es una región definida del cielo; las estrellas que parecen dibujar su figura suelen estar a distancias muy diferentes y no forman necesariamente un grupo físico.";
            }
            return "Análisis estelar completado, explorador. Casiopea se reconoce por cinco estrellas brillantes que forman una W o una M. Sus estrellas se encuentran a distancias distintas y solo parecen formar una figura desde nuestra perspectiva terrestre.";
        }

        if (name === "Cisne") {
            if (q.includes("triángulo") || q.includes("triangulo") || q.includes("verano")) {
                return "Triangulación celeste completada, explorador. El Triángulo de Verano lo forman Deneb, Vega y Altair, pertenecientes al Cisne, la Lira y el Águila. Es un asterismo, no una constelación oficial.";
            }
            if (q.includes("cruz")) {
                return "Asterismo identificado, explorador. La Cruz del Norte es el patrón de estrellas más conocido del Cisne: Deneb señala un extremo y Albireo el otro, con Sadr cerca del centro.";
            }
            if (q.includes("deneb") || q.includes("estrella")) {
                return "Lectura estelar de Cisne completada, explorador. Deneb es una supergigante blanca que marca la cola del Cisne y uno de los vértices del Triángulo de Verano.";
            }
            return "Mapa celeste actualizado, explorador. Cisne atraviesa la franja de la Vía Láctea y contiene la Cruz del Norte, cuyo extremo más brillante es Deneb.";
        }

        if (name === "Osa Menor") {
            if (q.includes("fija") || q.includes("mueve") || q.includes("norte") || q.includes("polaris")) {
                return "Orientación polar confirmada, explorador. Polaris está muy cerca de la dirección del polo norte celeste, por eso parece casi inmóvil mientras la Tierra gira. Su posición permite estimar el norte en el hemisferio norte.";
            }
            if (q.includes("brillante")) {
                return "Aclaración fotométrica, explorador. Polaris no es la estrella más brillante del cielo; es la más brillante de la Osa Menor y destaca por su cercanía al polo norte celeste.";
            }
            if (q.includes("estrella") || q.includes("carro")) {
                return "Censo de la Osa Menor completado, explorador. El Carro Menor incluye Polaris, Yildun, Epsilon, Zeta y Eta Ursae Minoris, además de Kochab y Pherkad en el cuenco. Polaris marca el extremo del mango.";
            }
            return "Orientación polar confirmada, explorador. Polaris, en la Osa Menor, aparece cerca del polo norte celeste y ayuda a encontrar el norte. No es la estrella más brillante del cielo.";
        }

        if (name === "Galaxia del Remolino") {
            if (q.includes("ngc 5195") || q.includes("compañera") || q.includes("relación")) {
                return "Análisis gravitacional completado, explorador. M51 interactúa con su compañera NGC 5195; ese encuentro ayuda a deformar y resaltar sus brazos espirales.";
            }
            if (q.includes("brazo") || q.includes("espiral") || q.includes("forma")) {
                return "Morfología de M51 confirmada, explorador. Es una galaxia espiral de gran diseño vista de frente, con brazos bien definidos que contienen gas, polvo y regiones de formación estelar.";
            }
            return "Análisis de M51 completado, explorador. La Galaxia del Remolino es una espiral cuyos brazos interactúan gravitacionalmente con la galaxia compañera NGC 5195. Hubble y otros observatorios han estudiado sus regiones de formación estelar.";
        }

        if (name === "Vía Láctea") {
            if (q.includes("tipo") || q.includes("espiral")) return "Diagnóstico astrofísico procesado, explorador. La Vía Láctea es una galaxia espiral barrada de unos 100.000 años luz de diámetro, con una barra central y brazos de gas, polvo y estrellas.";
            if (q.includes("estrella") || q.includes("cuántas") || q.includes("cuantas")) return "Censo estelar actualizado, explorador. La Vía Láctea contiene entre 100.000 y 400.000 millones de estrellas, muchas de ellas enanas rojas.";
            if (q.includes("sistema solar") || q.includes("dónde") || q.includes("donde")) return "Coordenadas fijadas, explorador. El sistema solar está en el Brazo de Orión, a unos 27.000 años luz del centro galáctico, y tarda alrededor de 230 millones de años en orbitarlo.";
            return "Panorámica de la Vía Láctea desplegada, explorador. En su centro se encuentra Sagitario A*, un agujero negro supermasivo de unos cuatro millones de masas solares.";
        }

        if (name === "Andrómeda") {
            if (q.includes("distancia") || q.includes("dónde") || q.includes("donde")) return "Medición astronómica completada, explorador. Andrómeda (M31) está a unos 2,5 millones de años luz y es la gran galaxia más cercana a la Vía Láctea.";
            if (q.includes("tamaño") || q.includes("cuánto") || q.includes("cuanto")) return "Dimensiones estelares registradas, explorador. El disco de Andrómeda se extiende por unos 200.000 años luz y contiene cientos de miles de millones de estrellas.";
            if (q.includes("colision") || q.includes("chocar") || q.includes("fusion")) return "Proyección orbital en curso, explorador. Andrómeda y la Vía Láctea se aproximan y podrían fusionarse dentro de varios miles de millones de años; el momento y el resultado exactos aún tienen incertidumbre.";
            return "Observación profunda de Andrómeda finalizada, explorador. M31 es una galaxia espiral del Grupo Local acompañada por galaxias enanas como M32 y M110.";
        }

        if (name === "Galaxia de Bode") {
            if (q.includes("m82") || q.includes("cigarro") || q.includes("relación")) return "Vínculo galáctico confirmado, explorador. M81, la Galaxia de Bode, interactúa gravitacionalmente con su vecina M82; ese encuentro influyó en la estructura de ambas y en la actividad de formación estelar de M82.";
            if (q.includes("brazo") || q.includes("espiral") || q.includes("forma")) return "Morfología de M81 analizada, explorador. Es una galaxia espiral de gran diseño cuyos brazos definidos se curvan alrededor de un bulbo central brillante.";
            if (q.includes("nombre") || q.includes("bode") || q.includes("descub")) return "Registro histórico de M81 consultado, explorador. Johann Elert Bode la descubrió en 1774; también está catalogada como Messier 81.";
            return "Análisis de M81 completado, explorador. La Galaxia de Bode es una espiral de gran diseño situada en la Osa Mayor y forma un par de interacción con M82.";
        }

        if (name === "Galaxia del Cigarro") {
            if (q.includes("rápido") || q.includes("estallido") || q.includes("forma estrellas")) return "Actividad estelar elevada detectada, explorador. M82 atraviesa un episodio de formación de estrellas intenso, relacionado en parte con interacciones gravitatorias con M81. Las estrellas masivas recién formadas contribuyen a sus vientos galácticos.";
            if (q.includes("viento") || q.includes("expulsa")) return "Vientos galácticos registrados, explorador. La energía de estrellas masivas y sus explosiones como supernovas impulsa gas y polvo fuera de las regiones centrales de M82.";
            if (q.includes("m81") || q.includes("influye") || q.includes("interacción")) return "Interacción M81–M82 confirmada, explorador. La gravedad de M81 perturbó el gas de su vecina y probablemente contribuyó a desencadenar la intensa formación estelar de M82.";
            return "Lectura de M82 completada, explorador. La Galaxia del Cigarro es una galaxia de estallido estelar que vemos casi de canto, con vientos que salen de sus regiones centrales.";
        }

        if (name === "Galaxia del Sombrero") {
            if (q.includes("franja") || q.includes("banda") || q.includes("polvo")) return "Banda de polvo identificada, explorador. La franja oscura de M104 es polvo que absorbe la luz y cruza el disco, que vemos inclinado casi de canto.";
            if (q.includes("forma") || q.includes("tipo") || q.includes("espiral")) return "Clasificación de M104 completada, explorador. La Galaxia del Sombrero tiene un disco con estructura espiral, un gran bulbo central y una prominente banda de polvo.";
            if (q.includes("cúmulo") || q.includes("globular")) return "Censo de cúmulos en curso, explorador. M104 está rodeada por numerosos cúmulos globulares, agrupaciones compactas de estrellas antiguas que orbitan la galaxia.";
            return "Observación de M104 registrada, explorador. Su bulbo luminoso y su marcada banda de polvo se ven casi de canto; la galaxia no tiene forma literal de sombrero.";
        }

        if (name === "Galaxia del Molinete") {
            if (q.includes("frente") || q.includes("ver")) return "Geometría de M101 calculada, explorador. La vemos casi de frente, por lo que su disco y sus brazos espirales se distinguen con claridad.";
            if (q.includes("nacen") || q.includes("formación") || q.includes("estrellas")) return "Cuna estelar localizada, explorador. M101 posee brazos extensos con regiones de gas y polvo donde nacen estrellas.";
            if (q.includes("telescopio") || q.includes("hubble") || q.includes("observ")) return "Registro de observación confirmado, explorador. M101 ha sido estudiada en distintas longitudes de onda por observatorios terrestres y espaciales, incluido Hubble.";
            return "Panorámica de M101 desplegada, explorador. La Galaxia del Molinete es una gran espiral vista de frente, con brazos extensos que contienen regiones de formación estelar.";
        }

        if (name === "Galaxia M87") {
            if (q.includes("agujero negro") || q.includes("centro") || q.includes("imagen")) return "Imagen histórica localizada, explorador. En 2019, el Event Horizon Telescope publicó la primera imagen de la sombra del agujero negro supermasivo de M87, conocido como M87*.";
            if (q.includes("chorro") || q.includes("jet") || q.includes("partículas")) return "Chorro relativista detectado, explorador. El agujero negro supermasivo del centro de M87 alimenta un chorro de partículas que se extiende miles de años luz y viaja a velocidades cercanas a la luz.";
            if (q.includes("espiral") || q.includes("forma") || q.includes("tipo")) return "Morfología de M87 confirmada, explorador. Es una galaxia elíptica gigante, no una espiral, situada en el cúmulo de Virgo.";
            return "Datos de M87 recibidos, explorador. Es una galaxia elíptica gigante del cúmulo de Virgo, con un chorro de partículas que emerge de su región central.";
        }

        if (name === "NGC 2903") {
            if (q.includes("barra") || q.includes("barrada") || q.includes("diferencia")) return "Estructura central analizada, explorador. NGC 2903 es una espiral barrada: una concentración alargada de estrellas cruza su región central y conecta con los brazos.";
            if (q.includes("nacen") || q.includes("formación") || q.includes("estrellas")) return "Regiones activas detectadas, explorador. NGC 2903 presenta formación estelar en sus brazos y cerca de su núcleo, alimentada por gas interestelar.";
            if (q.includes("dónde") || q.includes("donde") || q.includes("constelación")) return "Coordenadas de NGC 2903 fijadas, explorador. Esta galaxia espiral barrada se encuentra en la constelación de Leo.";
            return "Análisis de NGC 2903 completado, explorador. Es una galaxia espiral barrada de Leo, con una barra central y regiones de formación estelar.";
        }

        if (name === "NGC 3532") {
            if (q.includes("diferencia") || q.includes("galaxia")) return "Clasificación confirmada, explorador. NGC 3532 no es una galaxia, sino un cúmulo abierto: estrellas relativamente jóvenes nacidas de la misma nube y ligadas débilmente por gravedad.";
            if (q.includes("dónde") || q.includes("donde") || q.includes("carina")) return "Coordenadas de NGC 3532 fijadas, explorador. Este cúmulo abierto se encuentra en la constelación austral de Carina y puede verse a simple vista desde cielos oscuros del hemisferio sur.";
            if (q.includes("estrella") || q.includes("contiene")) return "Censo del cúmulo completado, explorador. NGC 3532 contiene numerosas estrellas jóvenes que nacieron juntas y se dispersarán gradualmente con el tiempo.";
            return "Identificación confirmada, explorador. NGC 3532 es un cúmulo abierto de estrellas de la constelación Carina, no una galaxia.";
        }

        if (name === "Sol") {
            if (q.includes("temperatura") || q.includes("superficie")) {
                return "Telemetría solar recibida, explorador. La fotosfera del Sol alcanza unos 5.500 °C, mientras que su núcleo llega a unos 15 millones de grados Celsius. Sus temperaturas extremas sostienen la fusión nuclear que alimenta el sistema solar.";
            }
            if (q.includes("energía") || q.includes("produce")) {
                return "Análisis de espectrometría completado, explorador. El Sol produce su energía mediante fusión termonuclear, convirtiendo hidrógeno en helio. Este proceso genera la radiación que alimenta la vida en la Tierra.";
            }
            return "Datos solares actualizados, explorador. El Sol concentra casi toda la masa del sistema solar y gobierna las órbitas de los planetas.";
        }

        return `Análisis completado, explorador. El objeto ${name} se encuentra registrado en los mapas de vuelo de la nave y presenta datos astronómicos fiables para tu consulta. Mis protocolos de navegación siguen centrados en astronomía y exploración espacial.`;
    }

    async function sendQuestionToAi(questionText) {
        if (!currentAstro) return;

        // 1. Mostrar mensaje del explorador en el chat
        appendMessage("user", "EXPLORADOR", questionText);

        // 2. Activar estados de carga y bloqueo de botones
        setProcessingState(true);

        // 3. Preparar DTO para el Backend C#
        const requestPayload = {
            astroName: currentAstro.name,
            question: questionText
        };

        try {
            const response = await fetch("/api/ai/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                let errorMsg;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.errorMessage || `Error de enlace cuántico (${response.status})`;
                } catch {
                    errorMsg = response.status === 405
                        ? "El enlace de radio respondió con un protocolo no permitido; activando respaldo autónomo."
                        : `Error de enlace cuántico (${response.status})`;
                }

                const fallbackAnswer = buildLocalAstronomyAnswer(currentAstro.name, questionText);
                if (response.status === 405 || response.status === 500 || response.status === 404) {
                    typewriterResponse("COMPUTADORA DE A BORDO", fallbackAnswer);
                    return;
                }

                appendMessage("ai", "COMPUTADORA DE A BORDO", `Alerta de sistema, explorador: ${errorMsg}`);
                setProcessingState(false);
                return;
            }

            const data = await response.json();
            const aiAnswer = data.answer || "Datos recibidos, explorador. La telemetría no arrojó detalles adicionales.";

            // 4. Mostrar respuesta con el Efecto de Máquina de Escribir (seguro con textContent)
            typewriterResponse("COMPUTADORA DE A BORDO", aiAnswer);
        } catch (networkError) {
            console.error("Error al contactar con /api/ai/ask:", networkError);
            const fallbackAnswer = buildLocalAstronomyAnswer(currentAstro.name, questionText);
            typewriterResponse("COMPUTADORA DE A BORDO", fallbackAnswer);
        }
    }

    /**
     * Inserta un mensaje estático en el historial de conversación (textContent seguro).
     */
    function appendMessage(role, senderName, text) {
        if (!chatMessagesContainer) return;

        const bubble = document.createElement("div");
        bubble.className = `message-bubble ${role}`;

        const senderSpan = document.createElement("span");
        senderSpan.className = "msg-sender";
        senderSpan.textContent = `${senderName}:`;

        const contentP = document.createElement("p");
        contentP.className = "msg-content";
        contentP.textContent = text; // SEGURO: Evita ataques XSS

        bubble.appendChild(senderSpan);
        bubble.appendChild(contentP);
        chatMessagesContainer.appendChild(bubble);

        scrollChatToBottom();
        return contentP;
    }

    /**
     * ========================================================================
     * EFECTO DE MÁQUINA DE ESCRIBIR (TYPEWRITER) CON textContent SEGURO
     * Requisito Sección 6.3: Sin librerías externas, sin innerHTML inseguro.
     * ========================================================================
     */
    function typewriterResponse(senderName, fullText) {
        stopTypewriter();

        if (!chatMessagesContainer) {
            setProcessingState(false);
            return;
        }

        const bubble = document.createElement("div");
        bubble.className = "message-bubble ai";

        const senderSpan = document.createElement("span");
        senderSpan.className = "msg-sender";
        senderSpan.textContent = `${senderName}:`;

        const contentP = document.createElement("p");
        contentP.className = "msg-content";

        const cursorSpan = document.createElement("span");
        cursorSpan.className = "typing-cursor";

        bubble.appendChild(senderSpan);
        bubble.appendChild(contentP);
        bubble.appendChild(cursorSpan);
        chatMessagesContainer.appendChild(bubble);

        let charIndex = 0;
        const speedMs = 18; // Velocidad fluida y tecnológica

        typewriterIntervalId = setInterval(() => {
            if (charIndex < fullText.length) {
                // Inserción segura caracter a caracter mediante textContent
                contentP.textContent += fullText.charAt(charIndex);
                charIndex++;
                scrollChatToBottom();
            } else {
                stopTypewriter();
                // Retirar cursor parpadeante al finalizar la transmisión
                if (cursorSpan && cursorSpan.parentNode) {
                    cursorSpan.parentNode.removeChild(cursorSpan);
                }
                setProcessingState(false);
            }
        }, speedMs);
    }

    function stopTypewriter() {
        if (typewriterIntervalId !== null) {
            clearInterval(typewriterIntervalId);
            typewriterIntervalId = null;
        }
    }

    /**
     * Control del estado de procesamiento (loading y botones desactivados).
     */
    function setProcessingState(loading) {
        isProcessing = loading;

        if (chatLoadingIndicator) {
            if (loading) {
                chatLoadingIndicator.classList.remove("hidden");
            } else {
                chatLoadingIndicator.classList.add("hidden");
            }
        }

        if (btnSendChat) btnSendChat.disabled = loading;
        if (chatInput) chatInput.disabled = loading;

        // Desactivar botones de preguntas rápidas durante el envío
        if (quickPromptsContainer) {
            const buttons = quickPromptsContainer.querySelectorAll("button");
            buttons.forEach(b => b.disabled = loading);
        }

        if (!loading && chatInput) {
            chatInput.focus();
        }

        scrollChatToBottom();
    }

    function scrollChatToBottom() {
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }

    return {
        init,
        openAstroHud,
        closeHud,
        sendQuestionToAi
    };
})();

// Exportación global para entorno navegador
if (typeof window !== "undefined") {
    window.AiChatManager = AiChatManager;
}
