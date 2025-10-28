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
        this.recentSavedTimestamp = null;
        this.nameInputLetters = ['A', 'A', 'A'];
        this.nameInputPosition = 0;
        this._nameInputKeyHandler = null;
        
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
        this.nameInputScreen = document.getElementById('name-input-screen');
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
            case 'name-input':
                this.updateNameInput();
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
            this.changeState('name-input');
        }
    }

    updateNameInput() {
        // No-op: input handled via keydown listeners while in this state
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
            case 'name-input':
                this.showNameInputScreen();
                break;
        }
    }
    
    hideAllScreens() {
        if (this.idleScreen) this.idleScreen.style.display = 'none';
        if (this.introScreen) this.introScreen.style.display = 'none';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
        if (this.scoreboardScreen) this.scoreboardScreen.style.display = 'none';
        if (this.nameInputScreen) this.nameInputScreen.style.display = 'none';
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

    showNameInputScreen() {
        this.hideGameUI();
        if (!this.nameInputScreen) return;
        this.nameInputScreen.style.display = 'flex';

        // Reset name input state
        this.nameInputLetters = ['A', 'A', 'A'];
        this.nameInputPosition = 0;
        this.renderNameInputUI();
        this.attachNameInputListeners();
    }

    renderNameInputUI() {
        if (!this.nameInputScreen) return;
        const selectors = this.nameInputScreen.querySelectorAll('.letter-selector');
        selectors.forEach((selector, index) => {
            const val = selector.querySelector('.letter-value');
            if (val) val.textContent = this.nameInputLetters[index];
            if (index === this.nameInputPosition) selector.classList.add('active');
            else selector.classList.remove('active');
        });
    }

    attachNameInputListeners() {
        this.detachNameInputListeners();
        this._nameInputKeyHandler = (e) => {
            if (this.currentState !== 'name-input') return;
            const key = e.key;
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const pos = this.nameInputPosition;
            const current = this.nameInputLetters[pos];
            const idx = letters.indexOf(current);
            switch (key) {
                case 'ArrowDown': {
                    const nextIdx = (idx + 1) % letters.length;
                    this.nameInputLetters[pos] = letters[nextIdx];
                    this.renderNameInputUI();
                    break;
                }
                case 'ArrowUp': {
                    const nextIdx = (idx - 1 + letters.length) % letters.length;
                    this.nameInputLetters[pos] = letters[nextIdx];
                    this.renderNameInputUI();
                    break;
                }
                case 'ArrowRight': {
                    if (pos < 2) {
                        this.nameInputPosition = pos + 1;
                        this.renderNameInputUI();
                    } else {
                        this.submitNameInput();
                    }
                    break;
                }
                case 'ArrowLeft': {
                    if (pos > 0) {
                        this.nameInputPosition = pos - 1;
                        this.renderNameInputUI();
                    } else {
                        // If at first letter, treat as confirm as well
                        this.submitNameInput();
                    }
                    break;
                }
            }
        };
        document.addEventListener('keydown', this._nameInputKeyHandler);
    }

    detachNameInputListeners() {
        if (this._nameInputKeyHandler) {
            document.removeEventListener('keydown', this._nameInputKeyHandler);
            this._nameInputKeyHandler = null;
        }
    }

    submitNameInput() {
        const name = this.nameInputLetters.join('');
        if (window.tetrisGame) {
            const score = window.tetrisGame.score;
            const lines = window.tetrisGame.lines;
            const ts = this.saveScore(score, lines, name);
            this.recentSavedTimestamp = ts;
        }
        // Hide name input and show scoreboard immediately with highlight
        if (this.nameInputScreen) this.nameInputScreen.style.display = 'none';
        this.detachNameInputListeners();
        this.showScoreboard();
        // Transition to idle so normal loop resumes with scoreboard visible
        this.changeState('idle');
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
    
    saveScore(score, lines, name = 'AAA') {
        const ts = Date.now();
        const newScore = { score, lines, name, timestamp: ts };
        this.scoreHistory.unshift(newScore);
        if (this.scoreHistory.length > this.MAX_SCORE_HISTORY) {
            this.scoreHistory = this.scoreHistory.slice(0, this.MAX_SCORE_HISTORY);
        }
        this.saveScoreHistory();
        return ts;
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
            if (this.recentSavedTimestamp && entry.timestamp === this.recentSavedTimestamp) {
                item.classList.add('highlighted');
            }
            const name = (entry.name || 'AAA').substring(0, 3).toUpperCase();
            item.innerHTML = `
                <span class="rank">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="name">${name}</span>
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
