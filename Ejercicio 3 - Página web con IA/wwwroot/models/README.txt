============================================================================
ASTRONOMÍA 3D - DIRECTORIO DE MODELOS GLTF / GLB (/wwwroot/models)
============================================================================

Este directorio está reservado para almacenar los modelos 3D externos de los
cuerpos celestes en formato .glb o .gltf.

ESTRUCTURA DE NOMBRES SUGERIDA:
--------------------------------
1. Sistema Solar:
   - sol.glb
   - mercurio.glb
   - venus.glb
   - tierra.glb
   - marte.glb
   - jupiter.glb
   - saturno.glb
   - urano.glb
   - neptuno.glb

2. Constelaciones:
   - orion.glb
   - osa_mayor.glb

3. Galaxias:
   - via_lactea.glb
   - andromeda.glb

INTEGRACIÓN TÉCNICA CON THREE.JS:
--------------------------------
En el archivo /wwwroot/js/scene.js, cada objeto tiene identificados los puntos
de integración mediante GLTFLoader con comentarios explícitos:

// AQUÍ DEBES CARGAR EL MODELO 3D EXTERNO MEDIANTE GLTFLoader.
// Sustituir el objeto provisional por el archivo .glb o .gltf correspondiente.

Ejemplo de uso:
const loader = new THREE.GLTFLoader();
loader.load('/models/marte.glb', (gltf) => {
    planetGroup.remove(planetMesh);
    planetGroup.add(gltf.scene);
    interactiveObjects.push(gltf.scene);
});
============================================================================
