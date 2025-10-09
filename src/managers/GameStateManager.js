// ==================== GAME STATE MANAGER ====================
export class GameStateManager {
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
        const tryStart = () => {
            // Permitir iniciar desde IDLE y también desde SCOREBOARD visible
            if (this.currentState === 'idle') {
                // Reproducir sonido de inicio inmediatamente al detectar la tecla
                if (typeof window.playGameStartSFX === 'function') {
                    window.playGameStartSFX();
                }
                
                // Si está mostrando scoreboard, ocultarlo y arrancar
                if (this.isShowingScoreboard) {
                    this.hideScoreboard();
                }
                this.startGame();
            }
        };
        document.addEventListener('keydown', tryStart);
        document.addEventListener('click', tryStart);
        document.addEventListener('touchstart', tryStart, { passive: true });
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
        
        // Limpiar cubos del juego para que no queden visibles en GAME OVER
        if (window.tetrisGame && typeof window.tetrisGame.clearAllCubes === 'function') {
            window.tetrisGame.clearAllCubes();
        }

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
            const scoreStr = window.tetrisGame.score.toString().padStart(7, '0');
            // Últimos 4 dígitos en amarillo, primeros 3 en gris
            const grayPart = scoreStr.slice(0, 3);
            const yellowPart = scoreStr.slice(3);
            scoreElement.innerHTML = `<span class="score-gray">${grayPart}</span><span class="score-yellow">${yellowPart}</span>`;
            
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
