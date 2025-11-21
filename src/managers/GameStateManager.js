import { splitPaddedNumber } from '../utils/formatting.js';
// ==================== GAME STATE MANAGER ====================
export class GameStateManager {
    constructor() {
        // this.idleScene = idleScene;
        this.currentState = 'idle';
        this.stateTimer = 0;
        this.scoreboardTimer = 0;
        this.isShowingScoreboard = false;
        
        this.introDuration = 3;
        this.scoreboardShowInterval = 7.5;
        this.scoreboardDisplayDuration = 5;
        this.gameOverDisplayDuration = 5;
        
        this.scoreHistory = [];
        this.MAX_SCORE_HISTORY = 50;
        this.recentSavedTimestamp = null;
        this.nameInputLetters = ['A', 'A', 'A'];
        this.nameInputPosition = 0;
        this._nameInputKeyHandler = null;
        this.forceScoreboard = false;
        
        this.initializeDOMElements();
        this.loadScoreHistory();
        this.setupEventListeners();
        this.changeState('idle');
    }
    
    initializeDOMElements() {
        this.idleScreen = document.getElementById('idle-screen');
        this.idleVideo = document.getElementById('idle-video');
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
        // If we just came from a game, keep the scoreboard visible and suppress idle title
        if (this.forceScoreboard) {
            if (!this.isShowingScoreboard) {
                this.showScoreboard();
            }
            this.forceScoreboard = false;
            return;
        }

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
                // If we just saved a score, show the scoreboard immediately without idle title
                if (this.forceScoreboard) {
                    this.showScoreboard();
                    this.isShowingScoreboard = true;
                    this.scoreboardTimer = 0;
                }
                this.showIdleScreen();
                break;
            case 'intro':
                // Reset forced scoreboard once a new round is starting
                this.forceScoreboard = false;
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
        // Restart video when idle screen is shown
        if (this.idleVideo) {
            this.idleVideo.currentTime = 0;
            this.idleVideo.play().catch(err => {
                console.warn('Error playing idle video:', err);
            });
        }
        //if (this.idleScene) this.idleScene.show();
    }
    
    showIntroScreen() {
        this.showGameUI();
        if (this.introScreen) this.introScreen.style.display = 'flex';
        this.showCountdown();
        // if (this.idleScene) this.idleScene.hide();
    }
    
    showGameScreen() {
        this.showGameUI();
        // if (this.idleScene) this.idleScene.hide();
    }
    
    showGameOverScreen() {
        if (!this.gameOverScreen) return;
        this.gameOverScreen.style.display = 'flex';
        
        // Limpiar cubos del juego para que no queden visibles en GAME OVER
        if (window.tetrisGame && typeof window.tetrisGame.clearAllCubes === 'function') {
            window.tetrisGame.clearAllCubes();
        }

        if (window.tetrisGame) {
            const scoreValue = document.getElementById('final-score-value');
            const linesValue = document.getElementById('final-lines-value');
            if (scoreValue) scoreValue.textContent = window.tetrisGame.score.toString();
            if (linesValue) linesValue.textContent = window.tetrisGame.lines.toString();
        }
    }

    showNameInputScreen() {
        this.hideGameUI();
        if (!this.nameInputScreen) return;
        
        // Select random encrypting message text
        const encryptingMessages = [
            'Encrypting high scores...',
            'That escalated quickly. Executing DR plan...',
            'Your S3 bucket was public. So is your score.',
            'Game over. Cost Explorer just flagged you for overspending.',
            'Instance terminated. Reason: slow reflexes.',
        ];
        const randomMessage = encryptingMessages[Math.floor(Math.random() * encryptingMessages.length)];
        
        // Update the encrypting message text
        const encryptingMessageElement = this.nameInputScreen.querySelector('.encrypting-message');
        if (encryptingMessageElement) {
            // Preserve the dots structure
            if(randomMessage.endsWith('...')) {
                const dotsHTML = '<span class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>';
                encryptingMessageElement.innerHTML = randomMessage.slice(0, -3) + dotsHTML;
            } else {
                encryptingMessageElement.innerHTML = randomMessage;
            }
        }
        
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
                default: {
                    this.submitNameInput();
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
        this.forceScoreboard = true;
        this.changeState('idle');
    }
    
    showScoreboard() {
        this.isShowingScoreboard = true;
        if (this.scoreboardScreen) {
            this.scoreboardScreen.style.display = 'flex';
            this.updateScoreboardDisplay();
        }
        // Activar escena idle para ocultar grid y mostrar cubos cayendo
        // if (this.idleScene && !this.idleScene.isActive) {
        //     this.idleScene.show();
        // }
    }
    
    hideScoreboard() {
        this.isShowingScoreboard = false;
        if (this.scoreboardScreen) this.scoreboardScreen.style.display = 'none';
        // Restart video when scoreboard is hidden and idle screen becomes visible again
        if (this.idleVideo) {
            this.idleVideo.currentTime = 0;
            this.idleVideo.play().catch(err => {
                console.warn('Error playing idle video:', err);
            });
        }
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
        if (window.tetrisGame) {
            window.tetrisGame.resetGame();
            this.updateGameUI();
        }
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
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            const { grayPart, yellowPart } = splitPaddedNumber(window.tetrisGame.score, 6);
            scoreElement.innerHTML = `<span class="score-gray">${grayPart}</span><span class="score-yellow">${yellowPart}</span>`;
        }
        const linesElement = document.getElementById('lines-number-footer');
        if (linesElement) {
            const { grayPart, yellowPart } = splitPaddedNumber(window.tetrisGame.lines, 2);
            linesElement.innerHTML = `<span class="score-gray">${grayPart}</span><span class="score-yellow">${yellowPart}</span>`;
        }
        const levelElement = document.getElementById('level-number-footer');
        if (levelElement) {
            const { grayPart, yellowPart } = splitPaddedNumber(window.tetrisGame.level, 2);
            levelElement.innerHTML = `<span class="score-gray">${grayPart}</span><span class="score-yellow">${yellowPart}</span>`;
        }
        if (typeof window.updateLogoFill === 'function') {
            if(window.tetrisGame.isYellowMode) {
                const elapsed = window.tetrisGame.gameTime - window.tetrisGame.yellowModeStartTime;
                const remaining = window.tetrisGame.YELLOW_MODE_DURATION - elapsed;
                if (remaining >= 0) {
                    window.updateLogoFill(remaining, window.tetrisGame.YELLOW_MODE_DURATION);
                }
            } else {
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

        if (sorted.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'scoreboard-empty';
            emptyMessage.textContent = 'No scores yet. Play to set a record!';
            listElement.appendChild(emptyMessage);
            return;
        }

        const maxRows = 10;
        const recentIdx = this.recentSavedTimestamp
            ? sorted.findIndex(e => e.timestamp === this.recentSavedTimestamp)
            : -1;

        // Build the list of entries to display (max 10)
        let displayEntries = [];
        if (sorted.length <= maxRows) {
            displayEntries = sorted.map((entry, index) => ({ entry, rank: index + 1 }));
        } else {
            // Start with top 10
            const topTen = sorted.slice(0, maxRows).map((entry, index) => ({ entry, rank: index + 1 }));
            if (recentIdx >= maxRows) {
                // Replace last row with the recent score but keep its true rank
                const recentEntry = { entry: sorted[recentIdx], rank: recentIdx + 1 };
                displayEntries = topTen.slice(0, maxRows - 1).concat(recentEntry);
            } else {
                displayEntries = topTen;
            }
        }

        displayEntries.forEach(({ entry, rank }) => {
            const item = document.createElement('div');
            item.className = 'scoreboard-item';
            if (this.recentSavedTimestamp && entry.timestamp === this.recentSavedTimestamp) {
                item.classList.add('highlighted');
            }
            const name = (entry.name || 'AAA').substring(0, 3).toUpperCase();
            item.innerHTML = `
                <span class="rank">${rank.toString()}</span>
                <span class="name">${name}</span>
                <span class="score">${entry.score.toString()}</span>
            `;
            listElement.appendChild(item);
        });
    }
}
