import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ==================== IDLE SCENE ====================
export class IdleScene {
    constructor(scene, camera, tetrisGame) {
        this.scene = scene;
        this.camera = camera;
        this.tetrisGame = tetrisGame;
        this.idleCubes = [];
        this.isActive = false;
        this.blockSize = 1.0;
        this.cameraRotationSpeed = 0.02; // Velocidad de rotación muy lenta
        
        // Guardar la configuración original de la cámara
        this.originalCameraPosition = camera.position.clone();
        this.originalCameraRotation = camera.rotation.clone();
    }
    
    createIdleCube(color) {
        const group = new THREE.Group();
        const lineColor = 0xdcee2d; // Amarillo para las aristas
        const lineRadius = 0.03;
        const size = this.blockSize * 0.9 / 2;
        
        // Material para las líneas (más brillante)
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: lineColor,
            transparent: true,
            opacity: 1.0 // Opacidad completa para líneas más visibles
        });
        
        // Cubo interior con textura (más brillante y más grande, casi del tamaño del contorno)
        const innerSize = this.blockSize * 0.88; // Más cerca del tamaño del contorno (0.9)
        const innerGeometry = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
        
        const textureLoader = new THREE.TextureLoader();
        const cubeTexture = textureLoader.load(
            new URL('../../assets/images/cube_high.jpg', import.meta.url).href
        );
        cubeTexture.colorSpace = THREE.SRGBColorSpace;

        const emissionTexture = textureLoader.load(
            new URL('../../assets/images/cube_emission_high.jpg', import.meta.url).href
        );
        emissionTexture.colorSpace = THREE.SRGBColorSpace;
        
        const innerMaterial = new THREE.MeshStandardMaterial({ 
            map: cubeTexture,
            emissiveMap: emissionTexture,
            emissive: new THREE.Color(0xdcee2d),
            emissiveIntensity: 5.0,
            transparent: true,
            opacity: 1.0, // Opacidad completa para textura más brillante
            roughness: 0.3,
            metalness: 0.1
        });
        
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
        group.add(innerCube);
        
        // Crear las 12 aristas del cubo
        const edges = [
            [[-size, -size, -size], [size, -size, -size]],
            [[size, -size, -size], [size, -size, size]],
            [[size, -size, size], [-size, -size, size]],
            [[-size, -size, size], [-size, -size, -size]],
            [[-size, size, -size], [size, size, -size]],
            [[size, size, -size], [size, size, size]],
            [[size, size, size], [-size, size, size]],
            [[-size, size, size], [-size, size, -size]],
            [[-size, -size, -size], [-size, size, -size]],
            [[size, -size, -size], [size, size, -size]],
            [[size, -size, size], [size, size, size]],
            [[-size, -size, size], [-size, size, size]]
        ];
        
        edges.forEach(([start, end]) => {
            const startVec = new THREE.Vector3(...start);
            const endVec = new THREE.Vector3(...end);
            const direction = new THREE.Vector3().subVectors(endVec, startVec);
            const length = direction.length();
            
            const geometry = new THREE.CylinderGeometry(lineRadius, lineRadius, length);
            const cylinder = new THREE.Mesh(geometry, lineMaterial);
            
            cylinder.position.copy(startVec).add(endVec).multiplyScalar(0.5);
            cylinder.lookAt(endVec);
            cylinder.rotateX(Math.PI / 2);
            
            group.add(cylinder);
        });
        
        return group;
    }
    
    show() {
        this.isActive = true;
        
        // Ocultar el grid de fondo
        if (this.tetrisGame && this.tetrisGame.backgroundLines) {
            this.tetrisGame.backgroundLines.forEach(line => {
                line.visible = false;
            });
        }
        
        // Configurar cámara para la escena idle
        // Zoom más cercano (frustumSize más pequeño = más zoom)
        const aspect = 1166 / 1920;
        const frustumSize = 2; // Muy zoomeado para ver solo 2 cubos de ancho
        
        this.camera.left = -frustumSize * aspect;
        this.camera.right = frustumSize * aspect;
        this.camera.top = frustumSize;
        this.camera.bottom = -frustumSize;
        this.camera.updateProjectionMatrix();
        
        // Posicionar cámara casi de frente con muy leve rotación picada
        this.camera.position.set(0.3, 0.8, 8); // Casi centrada, ligeramente arriba
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.x = -0.05 * Math.PI; // Muy leve rotación hacia abajo (5%)
        this.camera.rotation.y = 0.02 * Math.PI; // Mínima rotación horizontal
        
        // Crear grilla 3x6x4 (ancho x alto x profundidad)
        const cols = 3; // ancho (X)
        const rows = 6; // alto (Y)
        const depth = 4; // profundidad (Z)
        const spacing = 1.2; // Espaciado entre cubos
        
        // Generar posiciones posibles en la grilla
        const gridPositions = [];
        for (let z = 0; z < depth; z++) {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    gridPositions.push({
                        x: (x - (cols - 1) / 2) * spacing,
                        y: (y - (rows - 1) / 2) * spacing,
                        z: -z * spacing * 1.2
                    });
                }
            }
        }
        
        // Seleccionar 10 posiciones aleatorias
        const shuffled = gridPositions.sort(() => Math.random() - 0.5);
        const selectedPositions = shuffled.slice(0, 10);
        
        // Guardar configuración de la grilla para el scroll y snap
        this.gridSpacing = spacing;
        this.gridCols = cols;
        this.gridRows = rows;
        this.gridDepth = depth;
        this.gridMinY = -(rows - 1) / 2 * spacing;
        this.gridMaxY = (rows - 1) / 2 * spacing;
        this.gridHeight = this.gridMaxY - this.gridMinY;
        this.scrollSpeed = 0.5; // Velocidad de bajada
        
        // Crear 10 cubos en las posiciones seleccionadas
        selectedPositions.forEach(pos => {
            const cube = this.createIdleCube();
            cube.position.set(pos.x, pos.y, pos.z);
            cube.rotation.set(0, 0, 0); // Sin rotación
            
            // Guardar posición en la grilla (índices)
            cube.userData.gridX = Math.round((pos.x / spacing) + (cols - 1) / 2);
            cube.userData.gridY = Math.round((pos.y / spacing) + (rows - 1) / 2);
            cube.userData.gridZ = Math.round((-pos.z / (spacing * 1.2)));
            cube.userData.yOffset = 0; // Offset de scroll acumulado
            
            this.scene.add(cube);
            this.idleCubes.push(cube);
        });
    }
    
    hide() {
        this.isActive = false;
        
        // Mostrar el grid de fondo nuevamente
        if (this.tetrisGame && this.tetrisGame.backgroundLines) {
            this.tetrisGame.backgroundLines.forEach(line => {
                line.visible = true;
            });
        }
        
        // Limpiar cubos de la escena
        this.idleCubes.forEach(cube => {
            this.scene.remove(cube);
        });
        this.idleCubes = [];
        
        // Restaurar configuración original de la cámara
        this.camera.position.copy(this.originalCameraPosition);
        this.camera.rotation.copy(this.originalCameraRotation);
        
        // Restaurar frustum original
        const aspect = 1166 / 1920;
        const frustumSize = 10;
        this.camera.left = -frustumSize * aspect;
        this.camera.right = frustumSize * aspect;
        this.camera.top = frustumSize;
        this.camera.bottom = -frustumSize;
        this.camera.updateProjectionMatrix();
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Rotación suave de la cámara (muy lenta)
        this.camera.rotation.y += this.cameraRotationSpeed * deltaTime;
        
        // Animar scroll hacia abajo de los cubos, manteniendo snap a grilla
        this.idleCubes.forEach(cube => {
            // Acumular el offset de scroll
            cube.userData.yOffset -= this.scrollSpeed * deltaTime;
            
            // Calcular posición Y snapeada a la grilla más el offset continuo
            const baseGridY = (cube.userData.gridY || 0) * this.gridSpacing - ((this.gridRows - 1) / 2) * this.gridSpacing;
            cube.position.y = baseGridY + cube.userData.yOffset;
            
            // Cuando el offset baja más de un spacing, ajustar el índice de grilla
            if (cube.userData.yOffset <= -this.gridSpacing) {
                cube.userData.yOffset += this.gridSpacing;
                cube.userData.gridY = (cube.userData.gridY || 0) - 1;
            }
            
            // Cuando el cubo sale por abajo, reposicionarlo arriba
            const margin = 2;
            if (cube.position.y < this.gridMinY - margin) {
                // Calcular cuántas filas necesita subir para estar arriba
                const rowsToJump = this.gridRows + Math.ceil(margin / this.gridSpacing) * 2;
                cube.userData.gridY = (cube.userData.gridY || 0) + rowsToJump;
                cube.userData.yOffset = 0;
            }
            
            // Mantener X y Z snapeados a la grilla (no cambian)
            const gridX = (cube.userData.gridX - (this.gridCols - 1) / 2) * this.gridSpacing;
            const gridZ = -cube.userData.gridZ * this.gridSpacing * 1.2;
            cube.position.x = gridX;
            cube.position.z = gridZ;
        });

        // Asegurar que siempre haya cubos cayendo: si por algún motivo se vacía la lista, re-crear
        if (this.idleCubes.length < 8) {
            // Crear algunos cubos adicionales en posiciones superiores aleatorias
            const extras = 8 - this.idleCubes.length;
            for (let i = 0; i < extras; i++) {
                const cube = this.createIdleCube();
                // Posición aleatoria en X/Z dentro de la grilla y por arriba
                const xIdx = Math.floor(Math.random() * this.gridCols);
                const zIdx = Math.floor(Math.random() * this.gridDepth);
                const yTopIdx = this.gridRows + Math.floor(Math.random() * 2); // un poco por encima
                cube.userData.gridX = xIdx;
                cube.userData.gridY = yTopIdx;
                cube.userData.gridZ = zIdx;
                cube.userData.yOffset = 0;
                // Colocar posición en mundo acorde
                cube.position.x = (xIdx - (this.gridCols - 1) / 2) * this.gridSpacing;
                cube.position.z = -zIdx * this.gridSpacing * 1.2;
                cube.position.y = this.gridMaxY + 2; // por arriba del top visible
                this.scene.add(cube);
                this.idleCubes.push(cube);
            }
        }
    }
}
