/**
 * ============================================================================
 * ASTRONOMÍA 3D - CATÁLOGO CENTRALIZADO DE OBJETOS CELESTES
 * Módulo JavaScript con objetos celestes divididos en las 3 grandes secciones:
 * 1. Sistema Solar (Sol + 8 Planetas)
 * 2. Constelaciones visibles y reconocidas desde la Tierra
 * 3. Galaxias observadas por misiones y telescopios de NASA
 * ============================================================================
 */

var AstronomyCatalog = {
    // ------------------------------------------------------------------------
    // SECCIÓN 1: SISTEMA SOLAR
    // ------------------------------------------------------------------------
    sistemaSolar: {
        id: "sistemaSolar",
        label: "Sistema Solar",
        description: "Región dominada gravitatoriamente por el Sol, que alberga ocho planetas principales, planetas enanos y asteroides.",
        defaultCamera: { x: 0, y: 400, z: 230 },
        objects: [
            {
                id: "sol",
                name: "Sol",
                category: "Sistema Solar",
                subtitle: "ESTRELLA ENANA AMARILLA // TIPO ESPECTRAL G2V",
                description: "El Sol es la estrella central de nuestro sistema y concentra el 99,86 % de su masa total. En su núcleo opera un reactor de fusión termonuclear que convierte 600 millones de toneladas de hidrógeno en helio cada segundo a 15 millones de grados Celsius.",
                quickPrompts: [
                    "¿Qué temperatura tiene su superficie?",
                    "¿Cómo produce su energía?",
                    "¿Cuánto tiempo de vida le queda?"
                ],
                visual: {
                    type: "sun",
                    radius: 24,
                    color: 0xffaa00,
                    emissive: 0xff7700,
                    position: { x: 0, y: 0, z: 0 },
                    roughness: 0.1,
                    glowColor: 0xff8800
                },
                cameraFocusOffset: { x: 0, y: 70, z: 110 }
            },
            {
                id: "mercurio",
                name: "Mercurio",
                category: "Sistema Solar",
                subtitle: "PLANETA ROCOSO // PRIMER MUNDO INTERIOR",
                description: "El planeta más cercano al Sol y el más pequeño del sistema solar. Carece de atmósfera densa para regular la temperatura, oscilando entre los abrasadores 430 °C diurnos y los gélidos -180 °C en la noche.",
                quickPrompts: [
                    "¿Por qué tiene temperaturas tan extremas?",
                    "¿Tiene atmósfera?",
                    "¿Cuánto dura un día allí?"
                ],
                visual: {
                    type: "planet",
                    radius: 2.4,
                    color: 0x8a8a8a,
                    position: { x: -29.7, y: 0, z: -18.5 },
                    orbitRadius: 35,
                    roughness: 0.9
                },
                cameraFocusOffset: { x: 20, y: 24, z: 34 }
            },
            {
                id: "venus",
                name: "Venus",
                category: "Sistema Solar",
                subtitle: "PLANETA ROCOSO // EL INFIERNO INVERNADERO",
                description: "El segundo planeta desde el Sol, envuelto en una atmósfera asfixiante de dióxido de carbono y nubes de ácido sulfúrico. Su efecto invernadero desbocado mantiene una temperatura superficial constante de 465 °C, convirtiéndolo en el mundo más caliente.",
                quickPrompts: [
                    "¿Por qué es el planeta más caliente?",
                    "¿Cómo es su atmósfera?",
                    "¿Podría existir vida allí?"
                ],
                visual: {
                    type: "planet",
                    radius: 4.1,
                    color: 0xe3bb76,
                    position: { x: 54, y: 0, z: 18 },
                    orbitRadius: 57,
                    roughness: 0.5
                },
                cameraFocusOffset: { x: -18, y: 28, z: 42 }
            },
            {
                id: "tierra",
                name: "Tierra",
                category: "Sistema Solar",
                subtitle: "PLANETA TELÚRICO // OASIS BIOLÓGICO",
                description: "Nuestro hogar planetario y el único mundo conocido que alberga vida. Su atmósfera rica en nitrógeno y oxígeno, su potente campo magnético protector y sus vastos océanos de agua líquida generan un equilibrio geobiológico irrepetible.",
                quickPrompts: [
                    "¿Qué hace posible la vida?",
                    "¿Cómo funciona su campo magnético?",
                    "¿Qué tan profunda es su atmósfera?"
                ],
                visual: {
                    type: "planet",
                    radius: 4.8,
                    color: 0x2277ff,
                    position: { x: -56, y: 0, z: 57 },
                    orbitRadius: 80,
                    hasClouds: true,
                    cloudColor: 0xffffff,
                    roughness: 0.4
                },
                cameraFocusOffset: { x: 18, y: 32, z: 48 }
            },
            {
                id: "marte",
                name: "Marte",
                category: "Sistema Solar",
                subtitle: "PLANETA ROCOSO // EL MUNDO ROJO",
                description: "El cuarto planeta desde el Sol, caracterizado por su tono rojizo debido al óxido de hierro. Alberga el colosal cañón Valles Marineris y el volcán Monte Olimpo. Aunque hoy es un desierto frío, en el pasado albergó ríos y lagos de agua líquida.",
                quickPrompts: [
                    "¿Por qué es de color rojizo?",
                    "¿Existe agua en Marte?",
                    "¿Podría existir vida allí?"
                ],
                visual: {
                    type: "planet",
                    radius: 3.8,
                    color: 0xc84c24,
                    position: { x: 90, y: 0, z: 43.6 },
                    orbitRadius: 100,
                    roughness: 0.8
                },
                cameraFocusOffset: { x: -18, y: 26, z: 38 }
            },
            {
                id: "jupiter",
                name: "Júpiter",
                category: "Sistema Solar",
                subtitle: "GIGANTE GASEOSO // REY DEL SISTEMA SOLAR",
                description: "El mayor de todos los planetas, con más del doble de masa que el resto de cuerpos del sistema solar combinados. Su atmósfera presenta bandas turbulentas de vientos huracanados y la legendaria Gran Mancha Roja, un anticiclón activo durante siglos.",
                quickPrompts: [
                    "¿Qué es la Gran Mancha Roja?",
                    "¿Cuántas lunas tiene?",
                    "¿Puedo aterrizar allí?"
                ],
                visual: {
                    type: "planet",
                    radius: 9,
                    color: 0xd9a066,
                    bands: true,
                    position: { x: -109.54, y: 0, z: -95 },
                    orbitRadius: 145,
                    roughness: 0.6
                },
                cameraFocusOffset: { x: 28, y: 58, z: 82 }
            },
            {
                id: "saturno",
                name: "Saturno",
                category: "Sistema Solar",
                subtitle: "GIGANTE GASEOSO // LA JOYA DE LOS ANILLOS",
                description: "Famoso por su espectacular e inigualable sistema de anillos compuestos por miles de millones de fragmentos de hielo de agua pura y polvo. Saturno es el planeta de menor densidad volumétrica del sistema solar, inferior incluso a la del agua líquida.",
                quickPrompts: [
                    "¿De qué están hechos sus anillos?",
                    "¿Cuántas lunas tiene?",
                    "¿Podrían desaparecer sus anillos?"
                ],
                visual: {
                    type: "planet",
                    radius: 7,
                    color: 0xead6a8,
                    hasRings: true,
                    ringInner: 9.1,
                    ringOuter: 17.8,
                    ringColor: 0xcdba96,
                    position: { x: 147, y: 0, z: -85 },
                    orbitRadius: 170,
                    roughness: 0.5
                },
                cameraFocusOffset: { x: -30, y: 52, z: 76 }
            },
            {
                id: "urano",
                name: "Urano",
                category: "Sistema Solar",
                subtitle: "GIGANTE DE HIELO // ROTACIÓN INCLINADA",
                description: "Un gigante de hielo con una atmósfera rica en metano que absorbe la luz roja y le otorga su color azul verdoso. Gira prácticamente recostado sobre su plano orbital, con una inclinación axial extrema de 98 grados, producto de una colisión protoplanetaria.",
                quickPrompts: [
                    "¿Por qué gira prácticamente de lado?",
                    "¿De qué está compuesto?",
                    "¿Qué temperaturas alcanza?"
                ],
                visual: {
                    type: "planet",
                    radius: 3,
                    color: 0x72d7d9,
                    hasRings: true,
                    ringTiltVertical: true,
                    ringInner: 4.2,
                    ringOuter: 5.8,
                    ringColor: 0x4fa8ab,
                    position: { x: -191, y: 0, z: -59 },
                    orbitRadius: 200,
                    roughness: 0.4
                },
                cameraFocusOffset: { x: 25, y: 30, z: 45 }
            },
            {
                id: "neptuno",
                name: "Neptuno",
                category: "Sistema Solar",
                subtitle: "GIGANTE DE HIELO // EL PLANETA DE LOS VIENTOS SUPERSÓNICOS",
                description: "El planeta más lejano del Sol, orbitando en las gélidas profundidades exteriores a más de 4.500 millones de kilómetros. Sus dinámicas atmosféricas desatan los vientos más feroces de todo el sistema solar, superando los 2.100 km/h.",
                quickPrompts: [
                    "¿Por qué tiene vientos tan intensos?",
                    "¿Qué color tiene su atmósfera?",
                    "¿Cuánto tarda en orbitar el Sol?"
                ],
                visual: {
                    type: "planet",
                    radius: 4,
                    color: 0x274fe0,
                    position: { x: 222, y: 0, z: 60 },
                    orbitRadius: 230,
                    roughness: 0.4
                },
                cameraFocusOffset: { x: -28, y: 34, z: 50 }
            }
        ]
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 2: CONSTELACIONES
    // ------------------------------------------------------------------------
    constelaciones: {
        id: "constelaciones",
        label: "Constelaciones",
        description: "Figuras aparentes del cielo reconocidas desde la Tierra. Sus estrellas suelen estar a distancias muy diferentes; NASA las estudia y cartografía, no las considera descubrimientos propios.",
        defaultCamera: { x: 0, y: 28, z: 175 },
        objects: [
            {
                id: "orion",
                name: "Orión",
                category: "Constelaciones",
                subtitle: "EL CAZADOR CELESTE // ASTERISMO ECUATORIAL",
                description: "Una de las constelaciones más majestuosas y reconocibles del firmamento. Enmarcada por las supergigantes Betelgeuse y Rigel, destaca su icónico cinturón formado por Alnitak, Alnilam y Mintaka, bajo el cual se ubica la gran nebulosa M42.",
                quickPrompts: [
                    "¿Cuáles son sus estrellas principales?",
                    "¿Dónde se encuentra la nebulosa de Orión?",
                    "¿A qué distancia está?"
                ],
                visual: {
                    type: "constellation",
                    center: { x: -25, y: 0, z: 0 },
                    color: 0x38bdf8,
                    stars: [
                        { name: "Betelgeuse", pos: [-6, 7, 0], color: 0xff4422, size: 1.1 },
                        { name: "Rigel", pos: [6, -7, 0], color: 0x88ccff, size: 1.0 },
                        { name: "Bellatrix", pos: [5, 6, 0], color: 0xbbddff, size: 0.8 },
                        { name: "Saiph", pos: [-5, -6, 0], color: 0xaaccff, size: 0.8 },
                        { name: "Alnitak", pos: [-2, 0, 0], color: 0xffffff, size: 0.7 },
                        { name: "Alnilam", pos: [0, 0, 0], color: 0xffffff, size: 0.7 },
                        { name: "Mintaka", pos: [2, 0, 0], color: 0xffffff, size: 0.7 }
                    ],
                    lines: [
                        [0, 2], [2, 6], [6, 5], [5, 4], [4, 0], [4, 3], [3, 1], [1, 6]
                    ]
                },
                cameraFocusOffset: { x: -25, y: 0, z: 28 }
            },
            {
                id: "osa_mayor",
                name: "Osa Mayor",
                category: "Constelaciones",
                subtitle: "ASTERISMO DEL CARRO // BALIZA CIRCUMPOLAR NORTE",
                description: "Constelación septentrional célebre por su asterismo de siete estrellas brillantes ('El Carro'). Sus estrellas punteras Merak y Dubhe permiten trazar una línea directa infalible hacia la Estrella Polar para la orientación de los navegantes.",
                quickPrompts: [
                    "¿Qué estrellas la forman?",
                    "¿Cómo puedo localizarla?",
                    "¿Qué relación tiene con la Estrella Polar?"
                ],
                visual: {
                    type: "constellation",
                    center: { x: 25, y: 0, z: 0 },
                    color: 0x8b5cf6,
                    stars: [
                        { name: "Dubhe", pos: [6, 4, 0], color: 0xffeedd, size: 0.9 },
                        { name: "Merak", pos: [6, 0, 0], color: 0xffffff, size: 0.8 },
                        { name: "Phecda", pos: [1, 0, 0], color: 0xffffff, size: 0.8 },
                        { name: "Megrez", pos: [0, 4, 0], color: 0xffffff, size: 0.7 },
                        { name: "Alioth", pos: [-4, 6, 0], color: 0xddeeff, size: 0.8 },
                        { name: "Mizar", pos: [-8, 7, 0], color: 0xffffff, size: 0.8 },
                        { name: "Alkaid", pos: [-12, 5, 0], color: 0xbbddff, size: 0.9 }
                    ],
                    lines: [
                        [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
                    ]
                },
                cameraFocusOffset: { x: 25, y: 2, z: 28 }
            },
            {
                id: "casiopea",
                name: "Casiopea",
                category: "Constelaciones",
                subtitle: "CONSTELACIÓN CIRCUMPOLAR // EL ASTERISMO EN FORMA DE W",
                description: "Casiopea es una constelación del hemisferio norte reconocible por cinco estrellas brillantes que forman una W o una M, según su posición en el cielo. Sus estrellas son sistemas independientes y no están a la misma distancia de la Tierra.",
                quickPrompts: [
                    "¿Qué estrellas forman la W?",
                    "¿Dónde está Casiopea en el cielo?",
                    "¿Qué es una constelación?"
                ],
                visual: {
                    type: "constellation",
                    center: { x: -58, y: 5, z: 0 },
                    color: 0xf0abfc,
                    stars: [
                        { name: "Caph", pos: [-10, 2, 0], color: 0xffffff, size: 0.85 },
                        { name: "Schedar", pos: [-5, -2, 0], color: 0xffe6c7, size: 1.0 },
                        { name: "Gamma Cas", pos: [0, 3, 0], color: 0xddeeff, size: 1.0 },
                        { name: "Ruchbah", pos: [5, -2, 0], color: 0xffffff, size: 0.8 },
                        { name: "Segin", pos: [10, 2, 0], color: 0xddeeff, size: 0.75 }
                    ],
                    lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
                },
                cameraFocusOffset: { x: -58, y: 3, z: 27 }
            },
            {
                id: "cisne",
                name: "Cisne",
                category: "Constelaciones",
                subtitle: "CONSTELACIÓN BOREAL // LA CRUZ DEL NORTE",
                description: "Cisne (Cygnus) recorre la Vía Láctea y contiene el asterismo conocido como la Cruz del Norte. Deneb, una de sus estrellas más luminosas, junto con Vega y Altair forma el Triángulo de Verano, aunque las tres estrellas no están unidas físicamente.",
                quickPrompts: [
                    "¿Cuál es la estrella Deneb?",
                    "¿Qué es la Cruz del Norte?",
                    "¿Qué estrellas forman el Triángulo de Verano?"
                ],
                visual: {
                    type: "constellation",
                    center: { x: 58, y: 5, z: 0 },
                    color: 0x67e8f9,
                    stars: [
                        { name: "Deneb", pos: [0, 10, 0], color: 0xddeeff, size: 1.05 },
                        { name: "Sadr", pos: [0, 2, 0], color: 0xfff1d5, size: 0.85 },
                        { name: "Albireo", pos: [0, -9, 0], color: 0xffc46b, size: 0.9 },
                        { name: "Gienah", pos: [-9, 0, 0], color: 0xffffff, size: 0.8 },
                        { name: "Delta Cygni", pos: [9, 1, 0], color: 0xddeeff, size: 0.75 }
                    ],
                    lines: [[0, 1], [1, 2], [3, 1], [1, 4]]
                },
                cameraFocusOffset: { x: 58, y: 3, z: 29 }
            },
            {
                id: "osa_menor",
                name: "Osa Menor",
                category: "Constelaciones",
                subtitle: "CONSTELACIÓN CIRCUMPOLAR // POLARIS Y EL POLO NORTE CELESTE",
                description: "Osa Menor es una constelación boreal cuyo extremo del mango del asterismo del Carro Menor está marcado por Polaris (la Estrella Polar). Polaris aparece cerca del polo norte celeste, pero no es la estrella más brillante del cielo.",
                quickPrompts: [
                    "¿Por qué Polaris parece fija?",
                    "¿Polaris es la estrella más brillante?",
                    "¿Qué estrellas forman el Carro Menor?"
                ],
                visual: {
                    type: "constellation",
                    center: { x: 0, y: -27, z: 0 },
                    color: 0xfde68a,
                    stars: [
                        { name: "Polaris", pos: [7, 7, 0], color: 0xfff2d5, size: 1.15 },
                        { name: "Yildun", pos: [3, 3, 0], color: 0xffffff, size: 0.65 },
                        { name: "Epsilon UMi", pos: [0, 0, 0], color: 0xffffff, size: 0.65 },
                        { name: "Zeta UMi", pos: [-3, -3, 0], color: 0xddeeff, size: 0.7 },
                        { name: "Eta UMi", pos: [-8, -4, 0], color: 0xffffff, size: 0.65 },
                        { name: "Pherkad", pos: [-9, 2, 0], color: 0xfff1d5, size: 0.8 },
                        { name: "Kochab", pos: [-5, 6, 0], color: 0xffdca8, size: 0.9 }
                    ],
                    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]]
                },
                cameraFocusOffset: { x: 0, y: -24, z: 29 }
            }
        ]
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 3: GALAXIAS
    // ------------------------------------------------------------------------
    galaxias: {
        id: "galaxias",
        label: "Galaxias",
        description: "Explora galaxias espirales, barradas, de canto y elípticas inspiradas en observaciones de NASA. Incluye NGC 3532 como comparación, correctamente identificado como cúmulo abierto, no como galaxia.",
        defaultCamera: { x: 0, y: 180, z: 220 },
        objects: [
            {
                id: "via_lactea",
                name: "Vía Láctea",
                category: "Galaxias",
                subtitle: "GALAXIA ESPIRAL BARRADA // NUESTRO HOGAR CÓSMICO",
                description: "La Vía Láctea es una galaxia espiral barrada cuyo disco se extiende por más de 100.000 años luz. El Sol se encuentra aproximadamente a mitad de camino entre el centro y el borde, en el brazo de Orión, y tarda unos 240 millones de años en completar una órbita galáctica.",
                quickPrompts: [
                    "¿Qué tipo de galaxia es?",
                    "¿Cuántas estrellas contiene aproximadamente?",
                    "¿Dónde se encuentra nuestro sistema solar?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "barred",
                    center: { x: -90, y: 0, z: -55 },
                    particleCount: 8200,
                    radius: 20,
                    arms: 4,
                    spin: 1.4,
                    pitchAngle: 20,
                    coreColor: 0xffd7a8,
                    armColor: 0x91b6e2,
                    tilt: { x: 0.08, y: 0.03, z: 0.04 },
                    showSolarMarker: true
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "andromeda",
                name: "Andrómeda",
                category: "Galaxias",
                subtitle: "GALAXIA ESPIRAL GIGANTE // MESSIER 31",
                description: "Andrómeda (M31) es la galaxia grande más cercana a la Vía Láctea. En imágenes ultravioleta de NASA, sus brazos de formación estelar aparecen inusualmente circulares y azules, en contraste con el bulbo central naranja-blanco de estrellas más antiguas.",
                quickPrompts: [
                    "¿A qué distancia se encuentra?",
                    "¿Qué tamaño tiene?",
                    "¿Colisionará con la Vía Láctea?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "spiral",
                    center: { x: -30, y: 0, z: -55 },
                    particleCount: 9000,
                    radius: 24,
                    arms: 2,
                    spin: 1.8,
                    pitchAngle: 10,
                    coreColor: 0xffe6c6,
                    armColor: 0x9cbbe2,
                    tilt: { x: 0.62, y: 0.08, z: 0.5 },
                    starFormingRegions: 28
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "m81",
                name: "Galaxia de Bode",
                category: "Galaxias",
                subtitle: "M81 // ESPIRAL DE GRAN DISEÑO",
                description: "M81, descubierta por Johann Elert Bode, es una galaxia espiral de gran diseño. Sus brazos azules de estrellas jóvenes y sus carriles de polvo se curvan hacia un bulbo central amplio y antiguo.",
                quickPrompts: [
                    "¿Por qué también se llama galaxia de Bode?",
                    "¿Qué muestran sus brazos espirales?",
                    "¿Qué relación tiene con M82?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "spiral",
                    center: { x: 30, y: 0, z: -55 },
                    particleCount: 6200,
                    radius: 17,
                    arms: 2,
                    pitchAngle: 23,
                    bulgeFraction: 0.4,
                    coreColor: 0xffdcae,
                    armColor: 0x91bfff,
                    tilt: { x: 0.1, y: 0.03, z: -0.08 },
                    starFormingRegions: 24
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "m82",
                name: "Galaxia del Cigarro",
                category: "Galaxias",
                subtitle: "M82 // GALAXIA DE ESTALLIDO ESTELAR",
                description: "M82 es una galaxia de estallido estelar cuya intensa formación de estrellas está relacionada con su interacción gravitatoria con M81. Vista de canto, expulsa vientos de gas y material desde las regiones centrales.",
                quickPrompts: [
                    "¿Por qué M82 forma estrellas tan rápido?",
                    "¿Qué provoca sus vientos galácticos?",
                    "¿Cómo influye M81 en M82?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "edgeOn",
                    center: { x: 90, y: 0, z: -55 },
                    particleCount: 5200,
                    radius: 13,
                    arms: 2,
                    coreColor: 0xffb16f,
                    armColor: 0xe78475,
                    tilt: { x: -0.72, y: 0.12, z: -0.08 },
                    jet: true,
                    jetColor: 0xff654f,
                    jetLength: 2.4,
                    jetWidth: 0.1,
                    jetOpacity: 0.45,
                    starFormingRegions: 18,
                    starFormingColor: 0xff896e,
                    diskThickness: 0.3,
                    pointSize: 1.55
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "remolino",
                name: "Galaxia del Remolino",
                category: "Galaxias",
                subtitle: "M51 // GALAXIA ESPIRAL EN INTERACCIÓN",
                description: "M51 es una galaxia espiral de gran diseño vista de frente. Sus brazos son regiones de formación estelar; la compañera NGC 5195 pasa cerca de uno de ellos y su interacción gravitatoria puede haberlo acentuado.",
                quickPrompts: [
                    "¿Por qué se llama Galaxia del Remolino?",
                    "¿Qué relación tiene con NGC 5195?",
                    "¿Qué revelan sus brazos espirales?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "spiral",
                    center: { x: -90, y: 0, z: 0 },
                    particleCount: 4200,
                    radius: 16,
                    arms: 2,
                    spin: 1.75,
                    pitchAngle: 26,
                    coreColor: 0xffe1b4,
                    armColor: 0x9bc7ff,
                    interaction: 0.22,
                    starFormingRegions: 24,
                    companion: { x: 18, y: 0, z: 6, radius: 5, color: 0xffdba8 }
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "sombrero",
                name: "Galaxia del Sombrero",
                category: "Galaxias",
                subtitle: "M104 // GALAXIA ESPIRAL CASI DE CANTO",
                description: "M104, la Galaxia del Sombrero, se observa casi de canto: destaca su bulbo blanco y brillante, rodeado por una banda gruesa de polvo que forma parte de su estructura espiral. NASA estima que alberga cerca de 2.000 cúmulos globulares.",
                quickPrompts: [
                    "¿Por qué parece un sombrero?",
                    "¿Qué es la franja oscura?",
                    "¿Qué forma tiene M104?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "edgeOn",
                    center: { x: -30, y: 0, z: 0 },
                    particleCount: 3600,
                    radius: 17,
                    arms: 2,
                    spin: 1.2,
                    coreColor: 0xfff2dc,
                    armColor: 0xd1b995,
                    tilt: { x: -1.05, y: 0.08, z: 0.08 },
                    globularClusters: 80
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "m101",
                name: "Galaxia del Molinete",
                category: "Galaxias",
                subtitle: "M101 // GALAXIA ESPIRAL DE GRAN DISEÑO",
                description: "M101, la Galaxia del Molinete, es una gran espiral vista de frente, con brazos extensos que contienen regiones de formación estelar. Ha sido observada en distintas longitudes de onda por observatorios de NASA, incluido Hubble.",
                quickPrompts: [
                    "¿Qué significa que se vea de frente?",
                    "¿Dónde nacen estrellas en M101?",
                    "¿Qué telescopios la han observado?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "spiral",
                    center: { x: 30, y: 0, z: 0 },
                    particleCount: 4000,
                    radius: 16,
                    arms: 5,
                    spin: 1.55,
                    pitchAngle: 32,
                    coreColor: 0xffe3bd,
                    armColor: 0x84baff,
                    tilt: { x: 0.08, y: 0.05, z: 0.04 },
                    starFormingRegions: 30
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "m87",
                name: "Galaxia M87",
                category: "Galaxias",
                subtitle: "M87 // GALAXIA ELÍPTICA GIGANTE CON CHORRO RELATIVISTA",
                description: "M87 es una galaxia elíptica gigante a unos 54 millones de años luz, con varios billones de estrellas y alrededor de 15.000 cúmulos globulares. Su agujero negro supermasivo impulsa un chorro de partículas que viaja a velocidades cercanas a la de la luz.",
                quickPrompts: [
                    "¿Qué se observó en el centro de M87?",
                    "¿Qué es el chorro de M87?",
                    "¿M87 es una galaxia espiral?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "elliptical",
                    center: { x: 90, y: 0, z: 0 },
                    particleCount: 3900,
                    radius: 15,
                    arms: 0,
                    spin: 0,
                    coreColor: 0xffe4bd,
                    armColor: 0xc3b9a8,
                    tilt: { x: 0.28, y: 0.1, z: -0.15 },
                    jet: true,
                    globularClusters: 180
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "ngc2903",
                name: "NGC 2903",
                category: "Galaxias",
                subtitle: "ESPIRAL BARRADA // CONSTELACIÓN DE LEO",
                description: "NGC 2903 es una galaxia espiral barrada cercana. Su barra central y sus regiones de formación estelar le dan una estructura distinta de las espirales de gran diseño como M81.",
                quickPrompts: [
                    "¿Qué hace que NGC 2903 sea barrada?",
                    "¿Dónde se forman estrellas en la galaxia?",
                    "¿Qué diferencia una galaxia barrada?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "barred",
                    center: { x: -30, y: 0, z: 55 },
                    particleCount: 5600,
                    radius: 16,
                    arms: 2,
                    pitchAngle: 25,
                    coreColor: 0xffd7a8,
                    armColor: 0x9fc4e9,
                    tilt: { x: 0.18, y: 0.05, z: 0.1 },
                    starFormingRegions: 20
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            },
            {
                id: "ngc3532",
                name: "NGC 3532",
                category: "Cúmulos estelares",
                subtitle: "CÚMULO ABIERTO // NO ES UNA GALAXIA",
                description: "NGC 3532 es un cúmulo abierto de estrellas de la constelación Carina, no una galaxia. Se incluye como comparación porque aparece junto a galaxias en la imagen de referencia.",
                quickPrompts: [
                    "¿Qué diferencia un cúmulo de una galaxia?",
                    "¿NGC 3532 es una galaxia?",
                    "¿Dónde se encuentra este cúmulo?"
                ],
                visual: {
                    type: "galaxy",
                    morphology: "cluster",
                    center: { x: 30, y: 0, z: 55 },
                    particleCount: 1800,
                    radius: 11,
                    arms: 0,
                    coreColor: 0x9bcfff,
                    armColor: 0xe5f3ff,
                    tilt: { x: 0.08, y: 0.02, z: 0.04 }
                },
                cameraFocusOffset: { x: 0, y: 42, z: 26 }
            }
        ]
    }
};

// Exportación global para entorno navegador
if (typeof window !== "undefined") {
    window.AstronomyCatalog = AstronomyCatalog;
}
