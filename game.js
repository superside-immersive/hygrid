import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ==================== GAME STATE MANAGER ====================
class GameStateManager {
    constructor(idleScene) {
        this.idleScene = idleScene;
        this.currentState = 'idle';
        this.stateTimer = 0;
        this.scoreboardTimer = 0;
        this.isShowingScoreboard = false;
        
        this.introDuration = 3;
        this.scoreboardShowInterval = 10;
        this.scoreboardDisplayDuration = 5;
        this.gameOverDisplayDuration = 5;
        
        this.scoreHistory = [];
        this.MAX_SCORE_HISTORY = 10;
        
        this.initializeDOMElements();
        this.loadScoreHistory();
        this.setupEventListeners();
        this.changeState('idle');
    }
    
    initializeDOMElements() {
        this.idleScreen = document.getElementById('idle-screen');
        this.introScreen = document.getElementById('intro-screen');
        this.gameOverScreen = document.getElementById('gameover-screen');
        this.scoreboardScreen = document.getElementById('scoreboard-screen');
        this.gameHeader = document.getElementById('game-header');
        this.gameFooter = document.getElementById('game-footer');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', () => {
            if (this.currentState === 'idle' && !this.isShowingScoreboard) {
                this.startGame();
            }
        });
    }
    
    update(deltaTime) {
        this.stateTimer += deltaTime;
        
        switch (this.currentState) {
            case 'idle':
                this.updateIdle(deltaTime);
                break;
            case 'intro':
                this.updateIntro();
                break;
            case 'playing':
                this.updatePlaying();
                break;
            case 'gameover':
                this.updateGameOver();
                break;
        }
    }
    
    updateIdle(deltaTime) {
        this.scoreboardTimer += deltaTime;
        
        if (!this.isShowingScoreboard && this.scoreboardTimer >= this.scoreboardShowInterval) {
            this.showScoreboard();
            this.scoreboardTimer = 0;
        }
        
        if (this.isShowingScoreboard && this.scoreboardTimer >= this.scoreboardDisplayDuration) {
            this.hideScoreboard();
            this.scoreboardTimer = 0;
        }
    }
    
    updateIntro() {
        if (this.stateTimer >= this.introDuration) {
            this.changeState('playing');
        }
    }
    
    updatePlaying() {
        if (window.tetrisGame && window.tetrisGame.isGameOver) {
            this.onGameOver();
        }
        this.updateGameUI();
    }
    
    updateGameOver() {
        if (this.stateTimer >= this.gameOverDisplayDuration) {
            this.changeState('idle');
        }
    }
    
    changeState(newState) {
        console.log(`🔄 Cambiando estado: ${this.currentState} → ${newState}`);
        this.currentState = newState;
        this.stateTimer = 0;
        this.hideAllScreens();
        
        switch (newState) {
            case 'idle':
                this.showIdleScreen();
                break;
            case 'intro':
                this.showIntroScreen();
                break;
            case 'playing':
                this.showGameScreen();
                this.startTetrisGame();
                break;
            case 'gameover':
                this.showGameOverScreen();
                break;
        }
    }
    
    hideAllScreens() {
        if (this.idleScreen) this.idleScreen.style.display = 'none';
        if (this.introScreen) this.introScreen.style.display = 'none';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
        if (this.scoreboardScreen) this.scoreboardScreen.style.display = 'none';
    }
    
    showGameUI() {
        if (this.gameHeader) this.gameHeader.style.display = 'block';
        if (this.gameFooter) this.gameFooter.style.display = 'flex';
    }
    
    hideGameUI() {
        if (this.gameHeader) this.gameHeader.style.display = 'none';
        if (this.gameFooter) this.gameFooter.style.display = 'none';
    }
    
    showIdleScreen() {
        this.hideGameUI();
        if (this.idleScreen) this.idleScreen.style.display = 'flex';
        if (this.idleScene) this.idleScene.show();
    }
    
    showIntroScreen() {
        this.hideGameUI();
        if (this.introScreen) this.introScreen.style.display = 'flex';
        this.showCountdown();
        if (this.idleScene) this.idleScene.hide();
    }
    
    showGameScreen() {
        this.showGameUI();
        if (this.idleScene) this.idleScene.hide();
    }
    
    showGameOverScreen() {
        this.hideGameUI();
        if (!this.gameOverScreen) return;
        this.gameOverScreen.style.display = 'flex';
        
        if (window.tetrisGame) {
            const scoreValue = document.getElementById('final-score-value');
            const linesValue = document.getElementById('final-lines-value');
            if (scoreValue) scoreValue.textContent = window.tetrisGame.score.toString().padStart(4, '0');
            if (linesValue) linesValue.textContent = window.tetrisGame.lines.toString().padStart(3, '0');
        }
    }
    
    showScoreboard() {
        this.isShowingScoreboard = true;
        if (this.scoreboardScreen) {
            this.scoreboardScreen.style.display = 'flex';
            this.updateScoreboardDisplay();
        }
        // Activar escena idle para ocultar grid y mostrar cubos cayendo
        if (this.idleScene && !this.idleScene.isActive) {
            this.idleScene.show();
        }
    }
    
    hideScoreboard() {
        this.isShowingScoreboard = false;
        if (this.scoreboardScreen) this.scoreboardScreen.style.display = 'none';
    }
    
    showCountdown() {
        const countdownElement = this.introScreen?.querySelector('.countdown');
        if (!countdownElement) return;
        
        let count = Math.ceil(this.introDuration);
        countdownElement.textContent = count.toString();
        
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownElement.textContent = count.toString();
            } else {
                countdownElement.textContent = 'GO!';
                setTimeout(() => clearInterval(interval), 500);
            }
        }, 1000);
    }
    
    startGame() {
        console.log('🎮 Iniciando juego...');
        this.changeState('intro');
    }
    
    startTetrisGame() {
        if (window.tetrisGame) {
            window.tetrisGame.startGame();
        }
    }
    
    onGameOver() {
        if (window.tetrisGame) {
            this.saveScore(window.tetrisGame.score, window.tetrisGame.lines);
        }
        this.changeState('gameover');
    }
    
    updateGameUI() {
        if (!this.gameFooter || !window.tetrisGame) return;
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = window.tetrisGame.score.toString().padStart(7, '0');
            if (typeof window.updateLogoFill === 'function') {
                // Calcular el progreso hacia el próximo power-up (score desde el último power-up)
                const progressScore = window.tetrisGame.score - window.tetrisGame.lastYellowModeScore;
                window.updateLogoFill(progressScore, window.tetrisGame.YELLOW_MODE_THRESHOLD);
            }
        }
    }
    
    saveScore(score, lines) {
        const newScore = { score, lines, timestamp: Date.now() };
        this.scoreHistory.unshift(newScore);
        if (this.scoreHistory.length > this.MAX_SCORE_HISTORY) {
            this.scoreHistory = this.scoreHistory.slice(0, this.MAX_SCORE_HISTORY);
        }
        this.saveScoreHistory();
    }
    
    loadScoreHistory() {
        try {
            const saved = localStorage.getItem('tetris-scores');
            if (saved) this.scoreHistory = JSON.parse(saved);
        } catch (error) {
            console.warn('Error cargando historial:', error);
        }
    }
    
    saveScoreHistory() {
        try {
            localStorage.setItem('tetris-scores', JSON.stringify(this.scoreHistory));
        } catch (error) {
            console.warn('Error guardando historial:', error);
        }
    }
    
    updateScoreboardDisplay() {
        if (!this.scoreboardScreen) return;
        const listElement = this.scoreboardScreen.querySelector('.scoreboard-list');
        if (!listElement) return;
        
        listElement.innerHTML = '';
        const sorted = [...this.scoreHistory].sort((a, b) => b.score - a.score);
        
        sorted.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'scoreboard-item';
            item.innerHTML = `
                <span class="rank">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="score">${entry.score.toString().padStart(7, '0')}</span>
                <span class="lines">${entry.lines.toString().padStart(3, '0')} LINES</span>
            `;
            listElement.appendChild(item);
        });
        
        if (sorted.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'scoreboard-empty';
            emptyMessage.textContent = 'No scores yet. Play to set a record!';
            listElement.appendChild(emptyMessage);
        }
    }
}

// ==================== IDLE SCENE ====================
class IdleScene {
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
        const cubeTexture = textureLoader.load('./cube.png');
        cubeTexture.colorSpace = THREE.SRGBColorSpace;
        
        const innerMaterial = new THREE.MeshBasicMaterial({ 
            map: cubeTexture,
            transparent: true,
            opacity: 1.0 // Opacidad completa para textura más brillante
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
    }
}

// ==================== TETRIS GAME ====================
class TetrisGame {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Board configuration
        this.boardWidth = 12;
        this.boardHeight = 20;
        this.blockSize = 1.0;
        
        // Colors
        this.RED_COLOR = 1;
        this.BLUE_COLOR = 2;
        this.GREEN_COLOR = 3;
        this.GRAY_COLOR = 4;
        this.YELLOW_COLOR_HEX = 0xdcee2d;
        
        // Game state
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.currentPieceCubes = [];
        this.currentColor = 1;
        this.pieceX = 0;
        this.pieceY = 0;
        this.ticks = 0;
        this.gameColors = [this.RED_COLOR, this.BLUE_COLOR, this.GREEN_COLOR];
        this.isInitialized = false;
        
        // Score & Level
        this.score = 0;
        this.lines = 0;
        this.goodPieces = 0;
        this.badPieces = 0;
        this.isGameOver = false;
        this.level = 1;
        this.LEVEL_THRESHOLD = 3000;
        this.BASE_TICK_CYCLE = 25;
        this.SPEED_INCREASE_PER_LEVEL = 0.15;
        
        // Yellow mode (bonus)
        this.lastYellowModeScore = 0;
        this.isYellowMode = false;
        this.yellowModeStartTime = 0;
        this.YELLOW_MODE_DURATION = 5;
        this.YELLOW_MODE_THRESHOLD = 10000;
        
        // Flash effects
        this.flashingCubes = new Map();
        this.flashDuration = 0.5; // 0.5 segundos
        this.gameTime = 0;
        
        // Background grid lines
        this.backgroundLines = [];
        
        // Materials
        this.createMaterials();
        
        // Pieces definition
        this.pieces = this.definePieces();
        
        // Initialize
        this.initializeBoard();
        this.createBackground();
    }
    
    createMaterials() {
        // Los materiales ya no son necesarios ya que usamos LineBasicMaterial
        // directamente en createBlock(). Mantengo las referencias para compatibilidad.
        this.redMaterial = null;
        this.blueMaterial = null;
        this.greenMaterial = null;
        this.grayMaterial = null;
        this.yellowMaterial = null;
    }
    
    definePieces() {
        return [
            // Piezas de 2 bloques (rojas)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 1 },
            // Piezas de 2 bloques (azules)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 2 },
            // Piezas de 2 bloques (verdes)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 3 },
            // Piezas de 3 bloques (rojas)
            { rotations: [[{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}], [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 1 },
            // Piezas de 3 bloques (azules)
            { rotations: [[{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}], [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 2 },
            // Piezas de 3 bloques (verdes)
            { rotations: [[{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}], [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 3 },
            // Piezas de 4 bloques cuadradas (rojas)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]], rotationState: 0, color: 1 },
            // Piezas de 4 bloques cuadradas (azules)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]], rotationState: 0, color: 2 },
            // Piezas de 4 bloques cuadradas (verdes)
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]], rotationState: 0, color: 3 },
            // Piezas multicolor de 2 bloques
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 1, blockColors: [[1, 2], [1, 2], [2, 1], [2, 1]] },
            { rotations: [[{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}], [{x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 2, blockColors: [[2, 3], [2, 3], [3, 2], [3, 2]] },
            // Piezas multicolor de 3 bloques
            { rotations: [[{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}], [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 1, blockColors: [[1, 1, 2], [1, 1, 2], [2, 1, 1], [2, 1, 1]] },
            { rotations: [[{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}], [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}], [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]], rotationState: 0, color: 2, blockColors: [[2, 2, 3], [2, 2, 3], [3, 2, 2], [3, 2, 2]] }
        ];
    }
    
    initializeBoard() {
        for (let y = 0; y < this.boardHeight; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y][x] = null;
            }
        }
    }
    
    createBackground() {
        // Crear grilla coloreada por zonas con efecto neón
        const RED_ZONE_COLOR = 0xcf4526;
        const BLUE_ZONE_COLOR = 0x21b1f8;
        const GREEN_ZONE_COLOR = 0x47ebcd;
        
        // Líneas horizontales
        for (let y = 0; y <= this.boardHeight; y++) {
            const worldY = y === 0 
                ? this.calculateWorldY(0) + this.blockSize / 2
                : this.calculateWorldY(y - 1) - this.blockSize / 2;
            
            this.createColoredHorizontalLine(worldY, 0, 3, RED_ZONE_COLOR);
            this.createColoredHorizontalLine(worldY, 4, 7, BLUE_ZONE_COLOR);
            this.createColoredHorizontalLine(worldY, 8, 11, GREEN_ZONE_COLOR);
        }
        
        // Líneas verticales
        for (let x = 0; x <= this.boardWidth; x++) {
            const worldX = x === 0
                ? this.calculateWorldX(0) - this.blockSize / 2
                : this.calculateWorldX(x - 1) + this.blockSize / 2;
            
            let lineColor;
            if (x >= 0 && x <= 4) lineColor = RED_ZONE_COLOR;
            else if (x >= 5 && x <= 8) lineColor = BLUE_ZONE_COLOR;
            else lineColor = GREEN_ZONE_COLOR;
            
            this.createColoredVerticalLine(worldX, lineColor);
        }
    }
    
    createColoredHorizontalLine(worldY, xStart, xEnd, color) {
        const points = [
            new THREE.Vector3(this.calculateWorldX(xStart) - this.blockSize / 2, worldY, -0.5),
            new THREE.Vector3(this.calculateWorldX(xEnd) + this.blockSize / 2, worldY, -0.5)
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.6,  // Más visible
            linewidth: 4   // Más grueso
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.backgroundLines.push(line); // Guardar referencia
    }
    
    createColoredVerticalLine(worldX, color) {
        const points = [
            new THREE.Vector3(worldX, this.calculateWorldY(0) + this.blockSize / 2, -0.5),
            new THREE.Vector3(worldX, this.calculateWorldY(this.boardHeight - 1) - this.blockSize / 2, -0.5)
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.6,  // Más visible  
            linewidth: 4   // Más grueso
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.backgroundLines.push(line); // Guardar referencia
    }
    
    chooseNextPiece() {
        const randomIndex = Math.floor(Math.random() * this.pieces.length);
        this.nextPiece = JSON.parse(JSON.stringify(this.pieces[randomIndex]));
        this.nextPiece.rotationState = 0;
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.chooseNextPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.chooseNextPiece();
        
        this.currentColor = this.currentPiece.color;
        this.pieceX = Math.floor(this.boardWidth / 2);
        this.pieceY = 0;
        
        if (!this.canMovePieceTo(this.pieceX, this.pieceY)) {
            this.endGame();
            return;
        }
        
        this.renderCurrentPiece();
    }
    
    movePiece() {
        this.pieceY++;
        
        if (!this.canMovePieceTo(this.pieceX, this.pieceY)) {
            this.pieceY--;
            this.lockPiece();
        } else {
            this.renderCurrentPiece();
        }
    }
    
    lockPiece() {
        const coords = this.getCurrentPieceCoords();
        let allInCorrectZone = true;
        let correctColorBlocks = 0; // Contador de bloques bien colocados
        
        coords.forEach((coord, index) => {
            const worldX = coord.x + this.pieceX;
            const worldY = coord.y + this.pieceY;
            
            if (worldY >= 0 && worldY < this.boardHeight && worldX >= 0 && worldX < this.boardWidth) {
                let blockColor = this.currentColor;
                
                if (this.currentPiece.blockColors) {
                    const rotState = this.currentPiece.rotationState;
                    const blockColors = this.currentPiece.blockColors[rotState];
                    if (blockColors && blockColors[index] !== undefined) {
                        blockColor = blockColors[index];
                    }
                }
                
                if (this.isYellowMode) {
                    blockColor = this.currentColor;
                }
                
                const cube = this.currentPieceCubes[index];
                if (cube) {
                    this.board[worldY][worldX] = cube;
                    cube.userData.color = blockColor;
                    
                    // En modo amarillo, NO guardar originalColor aún (se guardará cuando entre al tablero)
                    if (!this.isYellowMode) {
                        cube.userData.originalColor = blockColor;
                    } else {
                        // En modo amarillo, guardar el color real, no el amarillo visual
                        cube.userData.originalColor = blockColor;
                        // Mantener el color amarillo visual
                    }
                    
                    // Verificar si está en la zona correcta
                    const isCorrectZone = this.isInCorrectZone(worldX, blockColor);
                    
                    if (!isCorrectZone && !this.isYellowMode) {
                        // Pieza mal colocada: cambiar a gris y hacer flash de error
                        allInCorrectZone = false;
                        cube.userData.color = this.GRAY_COLOR;
                        this.applyColorToMesh(cube, this.GRAY_COLOR);
                        this.startFlashEffect(cube, false);
                        console.log(`❌ Bloque en zona incorrecta (${worldX}, ${worldY}) - Cambiado a GRIS`);
                    } else {
                        // Pieza bien colocada: hacer flash de éxito
                        correctColorBlocks++; // Contar bloques correctos
                        // En modo amarillo, NO hacer flash para que no cambie de color
                        if (!this.isYellowMode) {
                            this.startFlashEffect(cube, true);
                        }
                        console.log(`✅ Bloque en zona correcta (${worldX}, ${worldY})`);
                    }
                }
            }
        });
        
        // SISTEMA DE PUNTAJE: 100 puntos por cada bloque bien colocado
        if (correctColorBlocks > 0) {
            this.addScore(correctColorBlocks * 100);
            console.log(`💰 +${correctColorBlocks * 100} puntos por bloques correctos`);
        }
        
        // Reproducir SFX según si la pieza está bien o mal colocada
        if (allInCorrectZone) {
            this.goodPieces++;
            // Sonido positivo: pieza correcta
            if (typeof window.playCorrectPieceSFX === 'function') {
                window.playCorrectPieceSFX();
            }
        } else {
            this.badPieces++;
            // Sonido negativo: pieza incorrecta
            if (typeof window.playIncorrectPieceSFX === 'function') {
                window.playIncorrectPieceSFX();
            }
        }
        
        this.currentPieceCubes = [];
        this.checkLines();
        this.spawnPiece();
    }
    
    checkLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            // En modo amarillo, solo borrar líneas 100% completas que tengan al menos un cubo amarillo recién colocado
            if (this.isYellowMode) {
                if (this.isRowCompletelyFull(y) && this.rowHasYellowBlocks(y)) {
                    console.log(`🟡 Línea amarilla completa en fila ${y}`);
                    this.clearEntireRow(y);
                    this.moveRowsDown(y);
                    linesCleared++;
                    this.lines++;
                    y++; // Revisar la misma fila de nuevo
                    
                    if (typeof window.playLineClearSFX === 'function') {
                        window.playLineClearSFX();
                    }
                }
            } else {
                // Modo normal: verificar secciones de colores
                const completedSections = this.checkColorSections(y);
                
                if (completedSections > 0) {
                    console.log(`🔥 ${completedSections} secciones completadas en fila ${y}`);
                    this.clearEntireRow(y);
                    this.moveRowsDown(y);
                    linesCleared++;
                    this.lines++;
                    y++; // Revisar la misma fila de nuevo
                    
                    if (typeof window.playLineClearSFX === 'function') {
                        window.playLineClearSFX();
                    }
                }
            }
        }
        
        if (linesCleared > 0) {
            // 500 PUNTOS por cada línea completada (como en el original)
            this.addScore(500 * linesCleared);
            console.log(`✨ ${linesCleared} líneas eliminadas! +${500 * linesCleared} puntos`);
        }
    }
    
    isRowCompletelyFull(row) {
        // Verificar si TODAS las 12 columnas están llenas (sin importar color en modo amarillo)
        for (let x = 0; x < this.boardWidth; x++) {
            if (!this.board[row][x]) return false;
        }
        return true;
    }
    
    rowHasYellowBlocks(row) {
        // Verificar si al menos un cubo en esta fila está visualmente amarillo
        // (es decir, fue coloreado durante el modo amarillo actual)
        for (let x = 0; x < this.boardWidth; x++) {
            const cube = this.board[row][x];
            if (cube && cube instanceof THREE.Group) {
                // Revisar si algún hijo (arista) tiene el color amarillo
                for (let child of cube.children) {
                    if (child.material && !child.userData.isInnerCube) {
                        const hexColor = child.material.color.getHex();
                        if (hexColor === this.YELLOW_COLOR_HEX) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    checkColorSections(row) {
        let completedSections = 0;
        
        // Red zone (0-3)
        if (this.isSectionComplete(row, 0, 3, this.RED_COLOR)) completedSections++;
        // Blue zone (4-7)
        if (this.isSectionComplete(row, 4, 7, this.BLUE_COLOR)) completedSections++;
        // Green zone (8-11)
        if (this.isSectionComplete(row, 8, 11, this.GREEN_COLOR)) completedSections++;
        
        return completedSections;
    }
    
    isSectionComplete(row, startCol, endCol, expectedColor) {
        for (let x = startCol; x <= endCol; x++) {
            const cube = this.board[row][x];
            if (!cube) return false;
            
            // En modo normal, verificar el color correcto
            const cubeColor = cube.userData.originalColor || cube.userData.color || this.getCubeColor(cube);
            if (cubeColor !== expectedColor) {
                return false;
            }
        }
        return true;
    }
    
    clearEntireRow(row) {
        console.log(`🧹 Eliminando TODA la fila ${row}`);
        
        // Eliminar todos los cubos de la fila, independientemente del color
        for (let x = 0; x < this.boardWidth; x++) {
            const cube = this.board[row][x];
            if (cube) {
                // Limpiar efectos y cache
                this.flashingCubes.delete(cube);
                
                // Remover de la escena
                this.scene.remove(cube);
                this.board[row][x] = null;
            }
        }
        
        console.log(`✅ Fila ${row} completamente eliminada`);
    }
    
    moveRowsDown(clearedRow) {
        for (let y = clearedRow; y > 0; y--) {
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y][x] = this.board[y - 1][x];
                
                if (this.board[y][x]) {
                    this.board[y][x].position.y = this.calculateWorldY(y);
                }
            }
        }
        
        for (let x = 0; x < this.boardWidth; x++) {
            this.board[0][x] = null;
        }
    }
    
    addScore(points) {
        this.score += points;
        
        const newLevel = Math.floor(this.score / this.LEVEL_THRESHOLD) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            if (typeof window.updateLevel === 'function') {
                window.updateLevel(this.level);
            }
            if (typeof window.playLevelUpSFX === 'function') {
                window.playLevelUpSFX();
            }
            // Aumentar velocidad de la música según el nivel
            if (typeof window.setMusicTempo === 'function') {
                const tempo = 1.0 + (this.level - 1) * 0.1; // +10% por nivel
                window.setMusicTempo(tempo);
            }
        }
        
        // Yellow mode
        if (!this.isYellowMode && this.score - this.lastYellowModeScore >= this.YELLOW_MODE_THRESHOLD) {
            this.enterYellowMode();
        }
    }
    
    enterYellowMode() {
        this.isYellowMode = true;
        this.yellowModeStartTime = this.gameTime;
        this.lastYellowModeScore = this.score;
        
        if (typeof window.playEnterBonusSFX === 'function') {
            window.playEnterBonusSFX();
        }
        if (typeof window.triggerBonusFlash === 'function') {
            window.triggerBonusFlash();
        }
        
        // Convertir todos los bloques a amarillo (solo visual)
        this.convertAllBlocksToYellow();
        
        console.log('🟡 Modo amarillo activado!');
    }
    
    exitYellowMode() {
        this.isYellowMode = false;
        
        if (typeof window.hideYellowBonus === 'function') {
            window.hideYellowBonus();
        }
        
        // Restaurar colores originales
        this.restoreAllBlockColors();
        
        // Apagar el logo completamente y resetear para el próximo ciclo
        const logoFillWrapper = document.getElementById('logo-fill-wrapper');
        if (logoFillWrapper) {
            logoFillWrapper.classList.remove('filled');
            logoFillWrapper.style.height = '0%';
        }
        
        // Actualizar lastYellowModeScore al score actual para iniciar el conteo del próximo power-up
        this.lastYellowModeScore = this.score;
        
        console.log('🔵 Modo amarillo desactivado - Próximo power-up en:', this.lastYellowModeScore + this.YELLOW_MODE_THRESHOLD);
    }
    
    convertAllBlocksToYellow() {
        // Convertir todos los bloques del tablero a amarillo
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const cube = this.board[y][x];
                if (cube) {
                    if (!cube.userData.originalColor) {
                        cube.userData.originalColor = cube.userData.color || this.getCubeColor(cube);
                    }
                    // Aplicar color amarillo a Group (solo a las aristas, NO al cubo interior)
                    if (cube instanceof THREE.Group) {
                        cube.children.forEach(child => {
                            if (child.material && !child.userData.isInnerCube) {
                                child.material.color.setHex(this.YELLOW_COLOR_HEX);
                                child.material.opacity = 0.95; // Más brillante en modo amarillo
                            }
                        });
                    }
                }
            }
        }
        
        // Convertir la pieza actual también (solo aristas, NO cubo interior)
        this.currentPieceCubes.forEach(cube => {
            if (cube) {
                if (!cube.userData.originalColor) {
                    cube.userData.originalColor = cube.userData.color || this.currentColor;
                }
                if (cube instanceof THREE.Group) {
                    cube.children.forEach(child => {
                        if (child.material && !child.userData.isInnerCube) {
                            child.material.color.setHex(this.YELLOW_COLOR_HEX);
                            child.material.opacity = 0.95;
                        }
                    });
                }
            }
        });
    }
    
    restoreAllBlockColors() {
        // Restaurar colores de todos los bloques del tablero
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const cube = this.board[y][x];
                if (cube && cube.userData.originalColor !== undefined) {
                    const originalColor = cube.userData.originalColor;
                    cube.userData.color = originalColor;
                    this.applyColorToMesh(cube, originalColor);
                }
            }
        }
        
        // Restaurar colores de la pieza actual
        this.currentPieceCubes.forEach(cube => {
            if (cube && cube.userData.originalColor !== undefined) {
                const originalColor = cube.userData.originalColor;
                cube.userData.color = originalColor;
                this.applyColorToMesh(cube, originalColor);
            }
        });
    }
    
    endGame() {
        this.isGameOver = true;
        console.log('💀 Game Over');
        
        if (typeof window.stopMusic === 'function') {
            window.stopMusic();
        }
    }
    
    resetGame() {
        console.log('🔄 Reseteando juego...');
        
        // Limpiar tablero
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.scene.remove(this.board[y][x]);
                    this.board[y][x] = null;
                }
            }
        }
        
        // Limpiar pieza actual
        this.currentPieceCubes.forEach(cube => this.scene.remove(cube));
        this.currentPieceCubes = [];
        
        // Resetear variables
        this.score = 0;
        this.lines = 0;
        this.goodPieces = 0;
        this.badPieces = 0;
        this.level = 1;
        this.isGameOver = false;
        this.isYellowMode = false;
        this.lastYellowModeScore = 0;
        this.ticks = 0;
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        if (typeof window.updateLevel === 'function') {
            window.updateLevel(1);
        }
        if (typeof window.hideYellowBonus === 'function') {
            window.hideYellowBonus();
        }
    }
    
    createBlock(color) {
        // Crear grupo para contener todas las líneas del cubo y el cubo interior
        const group = new THREE.Group();
        group.userData.color = color;
        
        // Obtener color para el material de líneas
        const lineColor = this.getColorByNumber(color);
        
        // Crear líneas gruesas usando cilindros pequeños
        const lineRadius = 0.03; // Grosor de las líneas
        const size = this.blockSize * 0.9 / 2;
        
        // Material para las líneas gruesas
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: lineColor,
            transparent: true,
            opacity: 0.9
        });
        
        // NUEVO: Crear cubo interior con textura
        const innerSize = this.blockSize * 0.75; // Levemente más chico (75% del tamaño)
        const innerGeometry = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
        
        // Cargar textura de cube.png
        const textureLoader = new THREE.TextureLoader();
        const cubeTexture = textureLoader.load('./cube.png');
        cubeTexture.colorSpace = THREE.SRGBColorSpace;
        
        const innerMaterial = new THREE.MeshBasicMaterial({ 
            map: cubeTexture,
            transparent: true,
            opacity: 0.8
        });
        
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
        innerCube.userData.isInnerCube = true; // Marcar como cubo interior
        group.add(innerCube);
        
        // Crear las 12 aristas del cubo usando cilindros
        const edges = [
            // Aristas inferiores (4)
            [[-size, -size, -size], [size, -size, -size]], // bottom front
            [[size, -size, -size], [size, -size, size]],   // bottom right
            [[size, -size, size], [-size, -size, size]],   // bottom back
            [[-size, -size, size], [-size, -size, -size]], // bottom left
            
            // Aristas superiores (4)
            [[-size, size, -size], [size, size, -size]],   // top front
            [[size, size, -size], [size, size, size]],     // top right
            [[size, size, size], [-size, size, size]],     // top back
            [[-size, size, size], [-size, size, -size]],   // top left
            
            // Aristas verticales (4)
            [[-size, -size, -size], [-size, size, -size]], // front left
            [[size, -size, -size], [size, size, -size]],   // front right
            [[size, -size, size], [size, size, size]],     // back right
            [[-size, -size, size], [-size, size, size]]    // back left
        ];
        
        edges.forEach(([start, end]) => {
            const startVec = new THREE.Vector3(...start);
            const endVec = new THREE.Vector3(...end);
            const direction = new THREE.Vector3().subVectors(endVec, startVec);
            const length = direction.length();
            
            // Crear cilindro para la línea
            const geometry = new THREE.CylinderGeometry(lineRadius, lineRadius, length);
            const cylinder = new THREE.Mesh(geometry, lineMaterial);
            
            // Posicionar y orientar el cilindro
            cylinder.position.copy(startVec).add(endVec).multiplyScalar(0.5);
            cylinder.lookAt(endVec);
            cylinder.rotateX(Math.PI / 2);
            
            group.add(cylinder);
        });
        
        return group;
    }
    
    getMaterialByColor(color) {
        if (this.isYellowMode) return this.yellowMaterial;
        
        switch (color) {
            case this.RED_COLOR: return this.redMaterial;
            case this.BLUE_COLOR: return this.blueMaterial;
            case this.GREEN_COLOR: return this.greenMaterial;
            case this.GRAY_COLOR: return this.grayMaterial;
            default: return this.grayMaterial;
        }
    }
    
    getColorByNumber(color) {
        switch (color) {
            case this.RED_COLOR: return 0xcf4526;
            case this.BLUE_COLOR: return 0x21b1f8;
            case this.GREEN_COLOR: return 0x47ebcd;
            case this.GRAY_COLOR: return 0x656565;
            default: return 0x656565;
        }
    }
    
    calculateWorldX(boardX) {
        return (boardX - this.boardWidth / 2 + 0.5) * this.blockSize;
    }
    
    calculateWorldY(boardY) {
        // Offset para bajar toda la escena y alinear el borde inferior con el footer
        const yOffset = -3.5;
        return (this.boardHeight / 2 - boardY - 0.5) * this.blockSize + yOffset;
    }
    
    getCurrentPieceCoords() {
        if (!this.currentPiece) return [];
        const rotState = this.currentPiece.rotationState;
        return this.currentPiece.rotations[rotState];
    }
    
    canMovePieceTo(x, y) {
        const coords = this.getCurrentPieceCoords();
        
        for (let coord of coords) {
            const worldX = coord.x + x;
            const worldY = coord.y + y;
            
            if (!this.isValidPosition(worldX, worldY)) {
                return false;
            }
            
            if (this.board[worldY] && this.board[worldY][worldX]) {
                return false;
            }
        }
        
        return true;
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
    }
    
    isInCorrectZone(x, pieceColor) {
        const zoneColor = this.getZoneColor(x);
        return zoneColor === pieceColor || this.isYellowMode;
    }
    
    getZoneColor(x) {
        if (x >= 0 && x <= 3) return this.RED_COLOR;
        if (x >= 4 && x <= 7) return this.BLUE_COLOR;
        if (x >= 8 && x <= 11) return this.GREEN_COLOR;
        return this.GRAY_COLOR;
    }
    
    getCubeColor(cube) {
        // Primero intentar obtener del userData
        if (cube.userData.originalColor !== undefined) {
            return cube.userData.originalColor;
        }
        if (cube.userData.color !== undefined) {
            return cube.userData.color;
        }
        
        if (!cube || !cube.material) return this.GRAY_COLOR;
        
        const material = cube.material;
        const color = material.color;
        
        // Comparar colores
        const colorHex = color.getHex();
        
        if (colorHex === 0xcf4526) return this.RED_COLOR;
        if (colorHex === 0x21b1f8) return this.BLUE_COLOR;
        if (colorHex === 0x47ebcd) return this.GREEN_COLOR;
        if (colorHex === 0x656565) return this.GRAY_COLOR;
        if (colorHex === this.YELLOW_COLOR_HEX) {
            // Si es amarillo, devolver el color original guardado
            return cube.userData.originalColor || this.currentColor;
        }
        
        return this.GRAY_COLOR;
    }
    
    renderCurrentPiece() {
        // Limpiar cubos actuales
        this.currentPieceCubes.forEach(cube => this.scene.remove(cube));
        this.currentPieceCubes = [];
        
        const coords = this.getCurrentPieceCoords();
        
        coords.forEach((coord, index) => {
            let blockColor = this.currentColor;
            
            if (this.currentPiece.blockColors) {
                const rotState = this.currentPiece.rotationState;
                const blockColors = this.currentPiece.blockColors[rotState];
                if (blockColors && blockColors[index] !== undefined) {
                    blockColor = blockColors[index];
                }
            }
            
            const cube = this.createBlock(blockColor);
            cube.position.set(
                this.calculateWorldX(coord.x + this.pieceX),
                this.calculateWorldY(coord.y + this.pieceY),
                0
            );
            
            // Si estamos en modo amarillo, guardar el color original y aplicar amarillo
            if (this.isYellowMode) {
                cube.userData.originalColor = blockColor;
                cube.userData.color = blockColor;
                // Aplicar color amarillo visualmente
                if (cube instanceof THREE.Group) {
                    cube.children.forEach(child => {
                        if (child.material && !child.userData.isInnerCube) {
                            child.material.color.setHex(this.YELLOW_COLOR_HEX);
                            child.material.opacity = 0.95;
                        }
                    });
                }
            }
            
            this.scene.add(cube);
            this.currentPieceCubes.push(cube);
        });
    }
    
    handleInput(key) {
        if (this.isGameOver) return;
        
        switch (key) {
            case 'ArrowLeft':
                if (this.canMovePieceTo(this.pieceX - 1, this.pieceY)) {
                    this.pieceX--;
                    this.renderCurrentPiece();
                }
                break;
            case 'ArrowRight':
                if (this.canMovePieceTo(this.pieceX + 1, this.pieceY)) {
                    this.pieceX++;
                    this.renderCurrentPiece();
                }
                break;
            case 'ArrowDown':
                if (this.canMovePieceTo(this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                    this.renderCurrentPiece();
                }
                break;
            case 'ArrowUp':
            case ' ':
                this.rotatePiece();
                break;
        }
    }
    
    rotatePiece() {
        const oldRotation = this.currentPiece.rotationState;
        this.currentPiece.rotationState = (this.currentPiece.rotationState + 1) % 4;
        
        if (!this.canMovePieceTo(this.pieceX, this.pieceY)) {
            this.currentPiece.rotationState = oldRotation;
        } else {
            this.renderCurrentPiece();
        }
    }
    
    startGame() {
        if (!this.isGameOver) {
            this.resetGame();
        } else {
            this.resetGame();
        }
        
        this.isInitialized = true;
        this.spawnPiece();
        
        if (typeof window.startMusic === 'function') {
            window.startMusic();
        }
        
        console.log('🎮 Juego iniciado!');
    }
    
    update(deltaTime) {
        if (!this.isInitialized || this.isGameOver) return;
        
        this.gameTime += deltaTime;
        
        // Update flash effects
        this.updateFlashEffects();
        
        // Yellow mode timer
        if (this.isYellowMode) {
            const elapsed = this.gameTime - this.yellowModeStartTime;
            const remaining = this.YELLOW_MODE_DURATION - elapsed;
            
            if (remaining > 0) {
                if (typeof window.showYellowBonus === 'function') {
                    window.showYellowBonus(remaining);
                }
            } else {
                this.exitYellowMode();
            }
        }
        
        // Gravity
        const speed = Math.min(4, 1 + (this.level - 1) * this.SPEED_INCREASE_PER_LEVEL);
        const tickCycle = Math.max(5, this.BASE_TICK_CYCLE / speed);
        
        this.ticks++;
        if (this.ticks >= tickCycle) {
            this.ticks = 0;
            this.movePiece();
        }
    }
    
    updateFlashEffects() {
        const currentTime = this.gameTime;
        const cubesToRemove = [];
        
        this.flashingCubes.forEach((flashData, cube) => {
            const elapsed = currentTime - flashData.startTime;
            
            if (elapsed >= this.flashDuration) {
                // El flash ha terminado
                if (flashData.isError) {
                    // Si era un error, ya está gris
                    this.applyColorToMesh(cube, this.GRAY_COLOR);
                } else {
                    // Si era éxito, restaurar color original
                    // PERO si estamos en modo amarillo, mantener amarillo
                    if (this.isYellowMode) {
                        // Mantener color amarillo visual
                        if (cube instanceof THREE.Group) {
                            cube.children.forEach(child => {
                                if (child.material && !child.userData.isInnerCube) {
                                    child.material.color.setHex(this.YELLOW_COLOR_HEX);
                                    child.material.opacity = 0.95;
                                }
                            });
                        }
                    } else {
                        this.applyColorToMesh(cube, flashData.originalColor);
                    }
                }
                cubesToRemove.push(cube);
            } else {
                // Flash en progreso - alternar entre intensidades
                const progress = elapsed / this.flashDuration;
                const flashCycle = Math.sin(progress * Math.PI * 8); // 8 pulsos
                const intensity = flashData.isError ? 0.1 : 0.8;
                
                if (flashCycle > 0) {
                    // Flash brillante
                    this.setMeshEmissiveIntensity(cube, intensity);
                } else {
                    // Flash tenue
                    this.setMeshEmissiveIntensity(cube, 0.4);
                }
            }
        });
        
        // Remover cubos que terminaron su flash
        cubesToRemove.forEach(cube => {
            this.flashingCubes.delete(cube);
        });
    }
    
    startFlashEffect(cube, isSuccess) {
        const originalColor = cube.userData.originalColor || cube.userData.color || this.currentColor;
        
        this.flashingCubes.set(cube, {
            startTime: this.gameTime,
            originalColor: originalColor,
            isError: !isSuccess
        });
        
        console.log(`🌟 Flash iniciado: ${isSuccess ? 'ÉXITO ✅' : 'ERROR ❌'}`);
    }
    
    applyColorToMesh(cube, color) {
        // Actualizar color para Group con múltiples cilindros (solo aristas, no el cubo interior)
        if (cube instanceof THREE.Group) {
            const newColor = this.getColorByNumber(color);
            cube.children.forEach(child => {
                // Solo actualizar color en los cilindros (aristas), no en el cubo interior
                if (child.material && !child.userData.isInnerCube) {
                    child.material.color.setHex(newColor);
                }
            });
        }
        cube.userData.color = color;
    }
    
    setMeshEmissiveIntensity(cube, intensity) {
        // Actualizar opacidad para Group con múltiples cilindros
        if (cube instanceof THREE.Group) {
            cube.children.forEach(child => {
                if (child.material) {
                    // Las aristas cambian de opacidad
                    if (!child.userData.isInnerCube) {
                        child.material.opacity = Math.max(0.5, intensity);
                    } else {
                        // El cubo interior mantiene opacidad constante
                        child.material.opacity = 0.8;
                    }
                }
            });
        }
    }
}

// ==================== MAIN APPLICATION ====================
class App {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();
        
        // Cámara ortográfica para vista más limpia
        const aspect = 1166 / 1920;
        // FrustumSize: tablero tiene 12 unidades de ancho, necesitamos que ocupe todo el ancho
        const frustumSize = 10; // Ajustado para que los 12 cubos ocupen exactamente el ancho del footer
        this.camera = new THREE.OrthographicCamera(
            -frustumSize * aspect, frustumSize * aspect,  // left, right
            frustumSize, -frustumSize,                    // top, bottom
            0.1, 1000                                     // near, far
        );
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        
        // Create game first (needed by idle scene)
        this.tetrisGame = new TetrisGame(this.scene, this.camera);
        window.tetrisGame = this.tetrisGame;
        
        // Create idle scene (needs tetrisGame reference)
        this.idleScene = new IdleScene(this.scene, this.camera, this.tetrisGame);
        window.idleScene = this.idleScene;
        
        // Create state manager
        this.gameStateManager = new GameStateManager(this.idleScene);
        window.gameStateManager = this.gameStateManager;
        
        // Input
        this.setupInput();
        
        // Animation loop
        this.clock = new THREE.Clock();
        this.animate();
    }
    
    setupRenderer() {
        this.renderer.setSize(1166, 1920);
        this.renderer.setClearColor(0x000000);
    }
    
    setupCamera() {
        // Cámara ortográfica posicionada para ver todo el tablero
        this.camera.position.z = 10;
        this.camera.position.y = -6.2;  // Ajustado para que el límite inferior de la escena 3D esté al borde del footer
        this.camera.position.x = 0;
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Más brillante para la escena idle
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Más intenso
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
        
        // Luz adicional desde el frente para mejor visibilidad
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
        frontLight.position.set(0, 0, 10);
        this.scene.add(frontLight);
    }
    
    setupInput() {
        document.addEventListener('keydown', (event) => {
            if (this.tetrisGame) {
                this.tetrisGame.handleInput(event.key);
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        if (this.idleScene) {
            this.idleScene.update(deltaTime);
        }
        
        if (this.tetrisGame) {
            this.tetrisGame.update(deltaTime);
        }
        
        if (this.gameStateManager) {
            this.gameStateManager.update(deltaTime);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the application
new App();
