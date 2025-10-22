import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ==================== TETRIS GAME ====================
export class TetrisGame {
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
        this.LEVEL_THRESHOLD = 10000;
        this.BASE_TICK_CYCLE = 25;
        this.SPEED_INCREASE_PER_LEVEL = 0.15;
        
        // Yellow mode (bonus)
        this.lastYellowModeScore = 0;
        this.isYellowMode = false;
        this.yellowModeStartTime = 0;
        this.YELLOW_MODE_DURATION = 10;
        this.YELLOW_MODE_THRESHOLD = 5000;
        
        // Flash effects
        this.flashingCubes = new Map();
        this.flashDuration = 0.5;
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
        const RED_ZONE_COLOR = 0xCF4526;
        const BLUE_ZONE_COLOR = 0x60DEFD;
        const GREEN_ZONE_COLOR = 0x45FE57;
        
        for (let y = 0; y <= this.boardHeight; y++) {
            const worldY = y === 0 
                ? this.calculateWorldY(0) + this.blockSize / 2
                : this.calculateWorldY(y - 1) - this.blockSize / 2;
            
            this.createColoredHorizontalLine(worldY, 0, 3, RED_ZONE_COLOR);
            this.createColoredHorizontalLine(worldY, 4, 7, BLUE_ZONE_COLOR);
            this.createColoredHorizontalLine(worldY, 8, 11, GREEN_ZONE_COLOR);
        }
        
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
            transparent: false, 
            opacity: 1.0,
            linewidth: 4
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.backgroundLines.push(line);
    }
    
    createColoredVerticalLine(worldX, color) {
        const points = [
            new THREE.Vector3(worldX, this.calculateWorldY(0) + this.blockSize / 2, -0.5),
            new THREE.Vector3(worldX, this.calculateWorldY(this.boardHeight - 1) - this.blockSize / 2, -0.5)
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: false, 
            opacity: 1.0,
            linewidth: 4
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.backgroundLines.push(line);
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
        let correctColorBlocks = 0;
        
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
                    
                    if (!this.isYellowMode) {
                        cube.userData.originalColor = blockColor;
                    } else {
                        cube.userData.originalColor = blockColor;
                    }
                    
                    const isCorrectZone = this.isInCorrectZone(worldX, blockColor);
                    
                    if (!isCorrectZone && !this.isYellowMode) {
                        allInCorrectZone = false;
                        cube.userData.color = this.GRAY_COLOR;
                        this.applyColorToMesh(cube, this.GRAY_COLOR);
                        this.startFlashEffect(cube, false);
                        console.log(`❌ Bloque en zona incorrecta (${worldX}, ${worldY}) - Cambiado a GRIS`);
                    } else {
                        correctColorBlocks++;
                        if (!this.isYellowMode) {
                            this.startFlashEffect(cube, true);
                        }
                        console.log(`✅ Bloque en zona correcta (${worldX}, ${worldY})`);
                    }
                }
            }
        });
        
        if (correctColorBlocks > 0) {
            this.addScore(correctColorBlocks * 100);
            console.log(`💰 +${correctColorBlocks * 100} puntos por bloques correctos`);
        }
        
        if (allInCorrectZone) {
            this.goodPieces++;
            if (typeof window.playCorrectPieceSFX === 'function') {
                window.playCorrectPieceSFX();
            }
        } else {
            this.badPieces++;
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
            if (this.isYellowMode) {
                if (this.isRowCompletelyFull(y) && this.rowHasYellowBlocks(y)) {
                    console.log(`🟡 Línea amarilla completa en fila ${y}`);
                    
                    this.clearEntireRow(y);
                    this.moveRowsDown(y);
                    linesCleared++;
                    this.lines++;
                    y++;
                    
                    if (typeof window.playLineClearSFX === 'function') {
                        window.playLineClearSFX();
                    }
                }
            } else {
                const completedSections = this.checkAllColorSections(y);
                
                if (completedSections > 0) {
                    console.log(`🔥 ${completedSections} secciones completadas en fila ${y}`);
                    
                    if (this.checkRedColorSection(y)) {
                        this.clearRedColorSectionRow(y);
                        this.moveRedColorSectionRowsDown(y);
                    }
                    if (this.checkBlueColorSection(y)) {
                        this.clearBlueColorSectionRow(y);
                        this.moveBlueColorSectionRowsDown(y);
                    }
                    if (this.checkGreenColorSection(y)) {
                        this.clearGreenColorSectionRow(y);
                        this.moveGreenColorSectionRowsDown(y);
                    }
                    linesCleared++;
                    this.lines++;
                    y++;
                    
                    if (typeof window.playLineClearSFX === 'function') {
                        window.playLineClearSFX();
                    }
                }
            }
        }
        
        if (linesCleared > 0) {
            this.addScore(500 * linesCleared);
            console.log(`✨ ${linesCleared} líneas eliminadas! +${500 * linesCleared} puntos`);
        }
    }
    
    isRowCompletelyFull(row) {
        for (let x = 0; x < this.boardWidth; x++) {
            if (!this.board[row][x]) return false;
        }
        return true;
    }
    
    rowHasYellowBlocks(row) {
        for (let x = 0; x < this.boardWidth; x++) {
            const cube = this.board[row][x];
            if (cube && cube instanceof THREE.Group) {
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

    checkRedColorSection(row) {
        return this.isSectionComplete(row, 0, 3, this.RED_COLOR);
    }

    checkBlueColorSection(row) {
        return this.isSectionComplete(row, 4, 7, this.BLUE_COLOR);
    }

    checkGreenColorSection(row) {
        return this.isSectionComplete(row, 8, 11, this.GREEN_COLOR);
    }
    
    checkAllColorSections(row) {
        let completedSections = 0;
        
        if (this.checkRedColorSection(row)) completedSections++;
        if (this.checkBlueColorSection(row)) completedSections++;
        if (this.checkGreenColorSection(row)) completedSections++;
        
        return completedSections;
    }
    
    isSectionComplete(row, startCol, endCol, expectedColor) {
        for (let x = startCol; x <= endCol; x++) {
            const cube = this.board[row][x];
            if (!cube) return false;
            
            const cubeColor = cube.userData.originalColor || cube.userData.color || this.getCubeColor(cube);
            if (cubeColor !== expectedColor) {
                return false;
            }
        }
        return true;
    }
    
    clearRedColorSectionRow(row) {
        console.log(`🧹 Eliminando la fila ${row} de la sección de color rojo`);
        
        for (let x = 0; x < 4; x++) {
            const cube = this.board[row][x];
            if (cube) {
                this.flashingCubes.delete(cube);
                this.scene.remove(cube);
                this.board[row][x] = null;
            }
        }
        
        console.log(`✅ Fila ${row} de la sección de color rojo eliminada`);
    }
    
    clearBlueColorSectionRow(row) {
        console.log(`🧹 Eliminando la fila ${row} de la sección de color azul`);
        
        for (let x = 4; x < 8; x++) {
            const cube = this.board[row][x];
            if (cube) {
                this.flashingCubes.delete(cube);
                this.scene.remove(cube);
                this.board[row][x] = null;
            }
        }
        
        console.log(`✅ Fila ${row} de la sección de color azul eliminada`);
    }
    
    clearGreenColorSectionRow(row) {
        console.log(`🧹 Eliminando la fila ${row} de la sección de color verde`);
        
        for (let x = 8; x < 12; x++) {
            const cube = this.board[row][x];
            if (cube) {
                this.flashingCubes.delete(cube);
                this.scene.remove(cube);
                this.board[row][x] = null;
            }
        }
        
        console.log(`✅ Fila ${row} de la sección de color verde eliminada`);
    }
    
    clearEntireRow(row) {
        console.log(`🧹 Eliminando TODA la fila ${row}`);
        
        for (let x = 0; x < this.boardWidth; x++) {
            const cube = this.board[row][x];
            if (cube) {
                this.flashingCubes.delete(cube);
                this.scene.remove(cube);
                this.board[row][x] = null;
            }
        }
        
        console.log(`✅ Fila ${row} completamente eliminada`);
    }
    
    moveRedColorSectionRowsDown(clearedRow) {
        for (let y = clearedRow; y > 0; y--) {
            for (let x = 0; x < 4; x++) {
                this.board[y][x] = this.board[y - 1][x];
                
                if (this.board[y][x]) {
                    this.board[y][x].position.y = this.calculateWorldY(y);
                }
            }
        }
        
        for (let x = 0; x < 4; x++) {
            this.board[0][x] = null;
        }
    }

    moveBlueColorSectionRowsDown(clearedRow) {
        for (let y = clearedRow; y > 0; y--) {
            for (let x = 4; x < 8; x++) {
                this.board[y][x] = this.board[y - 1][x];
                
                if (this.board[y][x]) {
                    this.board[y][x].position.y = this.calculateWorldY(y);
                }
            }
        }
        
        for (let x = 4; x < 8; x++) {
            this.board[0][x] = null;
        }
    }

    moveGreenColorSectionRowsDown(clearedRow) {
        for (let y = clearedRow; y > 0; y--) {
            for (let x = 8; x < 12; x++) {
                this.board[y][x] = this.board[y - 1][x];
                
                if (this.board[y][x]) {
                    this.board[y][x].position.y = this.calculateWorldY(y);
                }
            }
        }
        
        for (let x = 8; x < 12; x++) {
            this.board[0][x] = null;
        }
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
        
        // Actualizar UI del score
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            scoreElement.textContent = String(this.score).padStart(6, '0');
        }
        
        // Actualizar logo fill con progreso hacia el próximo power-up
        if (typeof window.updateLogoFill === 'function') {
            const progressScore = this.score - this.lastYellowModeScore;
            window.updateLogoFill(progressScore);
        }
        
        const newLevel = Math.floor(this.score / this.LEVEL_THRESHOLD) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            if (typeof window.updateLevel === 'function') {
                window.updateLevel(this.level);
            }
            if (typeof window.playLevelUpSFX === 'function') {
                window.playLevelUpSFX();
            }
            if (typeof window.showLevelUpOverlay === 'function') {
                window.showLevelUpOverlay(this.level);
            }
            if (typeof window.setMusicTempo === 'function') {
                const tempo = 1.0 + (this.level - 1) * 0.1;
                window.setMusicTempo(tempo);
            }
        }
        
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
        if (typeof window.showPowerUpOverlay === 'function') {
            window.showPowerUpOverlay();
        }
        
        this.convertAllBlocksToYellow();
        
        console.log('🟡 Modo amarillo activado!');
    }
    
    exitYellowMode() {
        this.isYellowMode = false;
        
        if (typeof window.hideYellowBonus === 'function') {
            window.hideYellowBonus();
        }
        
        this.restoreAllBlockColors();
        
        // Actualizar lastYellowModeScore ANTES de resetear el logo
        this.lastYellowModeScore = this.score;
        
        // Resetear el logo fill usando el sistema updateLogoFill
        if (typeof window.updateLogoFill === 'function') {
            window.updateLogoFill(0); // Empezar desde 0 para el próximo power-up
        }
        
        console.log('🔵 Modo amarillo desactivado - Próximo power-up en:', this.lastYellowModeScore + this.YELLOW_MODE_THRESHOLD);
    }
    
    convertAllBlocksToYellow() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const cube = this.board[y][x];
                if (cube) {
                    if (!cube.userData.originalColor) {
                        cube.userData.originalColor = cube.userData.color || this.getCubeColor(cube);
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
            }
        }
        
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

    // Eliminar todos los cubos del tablero y de la pieza actual,
    // sin tocar puntaje/estado, para limpiar la vista en GAME OVER
    clearAllCubes() {
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
        // Limpiar efectos pendientes para evitar referencias
        if (this.flashingCubes && this.flashingCubes.clear) {
            this.flashingCubes.clear();
        }
    }
    
    resetGame() {
        console.log('🔄 Reseteando juego...');
        
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.scene.remove(this.board[y][x]);
                    this.board[y][x] = null;
                }
            }
        }
        
        this.currentPieceCubes.forEach(cube => this.scene.remove(cube));
        this.currentPieceCubes = [];
        
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
        
        // Actualizar UI
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            scoreElement.textContent = '000000';
        }
        
        if (typeof window.updateLevel === 'function') {
            window.updateLevel(1);
        }
        if (typeof window.updateLogoFill === 'function') {
            window.updateLogoFill(0);
        }
        if (typeof window.hideYellowBonus === 'function') {
            window.hideYellowBonus();
        }
    }
    
    createBlock(color) {
        const group = new THREE.Group();
        group.userData.color = color;
        
        const lineColor = this.getColorByNumber(color);
        const lineRadius = 0.03;
        const size = this.blockSize * 0.9 / 2;
        
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: lineColor,
            transparent: true,
            opacity: 0.9
        });
        
        const innerSize = this.blockSize * 0.75;
        const innerGeometry = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
        
        const textureLoader = new THREE.TextureLoader();
        const cubeTexture = textureLoader.load(
            new URL('../../assets/images/cube.png', import.meta.url).href
        );
        cubeTexture.colorSpace = THREE.SRGBColorSpace;
        
        const innerMaterial = new THREE.MeshBasicMaterial({ 
            map: cubeTexture,
            transparent: true,
            opacity: 0.8
        });
        
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
        innerCube.userData.isInnerCube = true;
        group.add(innerCube);
        
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
            case this.RED_COLOR: return 0xCF4526;
            case this.BLUE_COLOR: return 0x60DEFD;
            case this.GREEN_COLOR: return 0x45FE57;
            case this.GRAY_COLOR: return 0x656565;
            default: return 0x656565;
        }
    }
    
    calculateWorldX(boardX) {
        return (boardX - this.boardWidth / 2 + 0.5) * this.blockSize;
    }
    
    calculateWorldY(boardY) {
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
        if (cube.userData.originalColor !== undefined) {
            return cube.userData.originalColor;
        }
        if (cube.userData.color !== undefined) {
            return cube.userData.color;
        }
        
        if (!cube || !cube.material) return this.GRAY_COLOR;
        
        const material = cube.material;
        const color = material.color;
        const colorHex = color.getHex();
        
        if (colorHex === 0xCF4526) return this.RED_COLOR;
        if (colorHex === 0x60DEFD) return this.BLUE_COLOR;
        if (colorHex === 0x45FE57) return this.GREEN_COLOR;
        if (colorHex === 0x656565) return this.GRAY_COLOR;
        if (colorHex === this.YELLOW_COLOR_HEX) {
            return cube.userData.originalColor || this.currentColor;
        }
        
        return this.GRAY_COLOR;
    }
    
    renderCurrentPiece() {
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
            
            if (this.isYellowMode) {
                cube.userData.originalColor = blockColor;
                cube.userData.color = blockColor;
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
                    if (typeof window.playMoveLeftSFX === 'function') {
                        window.playMoveLeftSFX();
                    }
                }
                break;
            case 'ArrowRight':
                if (this.canMovePieceTo(this.pieceX + 1, this.pieceY)) {
                    this.pieceX++;
                    this.renderCurrentPiece();
                    if (typeof window.playMoveRightSFX === 'function') {
                        window.playMoveRightSFX();
                    }
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
            case 'q':
            case 'Q':
                if (!this.isYellowMode) {
                    this.enterYellowMode();
                    console.log('⚡ Power-up amarillo activado manualmente con Q');
                }
                break;
        }
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
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
        
        this.updateFlashEffects();
        
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
                if (flashData.isError) {
                    this.applyColorToMesh(cube, this.GRAY_COLOR);
                } else {
                    if (this.isYellowMode) {
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
                const progress = elapsed / this.flashDuration;
                const flashCycle = Math.sin(progress * Math.PI * 8);
                const intensity = flashData.isError ? 0.1 : 0.8;
                
                if (flashCycle > 0) {
                    this.setMeshEmissiveIntensity(cube, intensity);
                } else {
                    this.setMeshEmissiveIntensity(cube, 0.4);
                }
            }
        });
        
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
        if (cube instanceof THREE.Group) {
            const newColor = this.getColorByNumber(color);
            cube.children.forEach(child => {
                if (child.material && !child.userData.isInnerCube) {
                    child.material.color.setHex(newColor);
                }
            });
        }
        cube.userData.color = color;
    }
    
    setMeshEmissiveIntensity(cube, intensity) {
        if (cube instanceof THREE.Group) {
            cube.children.forEach(child => {
                if (child.material) {
                    if (!child.userData.isInnerCube) {
                        child.material.opacity = Math.max(0.5, intensity);
                    } else {
                        child.material.opacity = 0.8;
                    }
                }
            });
        }
    }
}
