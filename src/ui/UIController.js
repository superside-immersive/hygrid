// ==================== UI CONTROLLER ====================
// Maneja toda la lógica de UI, scaling, y efectos visuales

export class UIController {
  constructor() {
    this.init();
  }

  init() {
    // Escalar UI al cargar y redimensionar
    window.addEventListener('load', () => this.scaleUI());
    window.addEventListener('resize', () => this.scaleUI());
    this.scaleUI();
  }

  // Función para escalar la UI manteniendo la proporción 16:9
  scaleUI() {
    const targetWidth = 900;
    const targetHeight = 1600;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY);
    
    const elements = [
      document.getElementById('game-canvas'),
      document.querySelector('.ui-overlay')
    ];
    
    elements.forEach(element => {
      if (element) {
        element.style.scale = scale;
      }
    });
  }

  // === SISTEMA DE LLENADO DEL LOGO ===
  updateLogoFill(score, maxScore = 7500) {
    const logoFillWrapper = document.getElementById('logo-fill-wrapper');
    if (!logoFillWrapper) return;
    
    // Calcular porcentaje de llenado (0-100%)
    const percentage = Math.min(100, (score / maxScore) * 100);
    // Ajustar altura del wrapper para revelar el logo de abajo hacia arriba
    logoFillWrapper.style.height = `${percentage}%`;
    
    // Cuando llega a 10K puntos, activar animación de brillo completo
    if (percentage >= 100) {
      logoFillWrapper.classList.add('filled');
    } else {
      logoFillWrapper.classList.remove('filled');
    }
  }

  // === SISTEMA DE NIVEL ===
  updateLevel(level) {
    const levelFooter = document.getElementById('level-number-footer');
    if (levelFooter) {
      levelFooter.textContent = level;
    }
  }

  // === EFECTOS VISUALES ===
  triggerBonusFlash() {
    const flashOverlay = document.getElementById('bonus-flash-overlay');
    if (!flashOverlay) return;
    
    flashOverlay.classList.remove('flash-active');
    void flashOverlay.offsetWidth; // Force reflow
    flashOverlay.classList.add('flash-active');
    
    setTimeout(() => {
      flashOverlay.classList.remove('flash-active');
    }, 1000);
  }

  // Mostrar overlay de power-up con SVG
  showPowerUpOverlay() {
    const overlay = document.getElementById('powerup-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = '<img src="./assets/images/powerupboard.svg" alt="Power Up!">';
    overlay.style.display = 'flex';
    
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 2000);
  }

  // Mostrar overlay de level up con SVG
  showLevelUpOverlay(level) {
    const overlay = document.getElementById('levelup-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = '<img src="./assets/images/levelup.svg" alt="Level Up!">';
    overlay.style.display = 'flex';
    
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 2000);
  }
}

// Crear instancia global y exportar funciones para compatibilidad con código legacy
const uiController = new UIController();

// Exportar funciones globales para que el HTML legacy pueda usarlas
window.updateLogoFill = (score, maxScore) => uiController.updateLogoFill(score, maxScore);
window.updateLevel = (level) => uiController.updateLevel(level);
window.triggerBonusFlash = () => uiController.triggerBonusFlash();
window.showPowerUpOverlay = () => uiController.showPowerUpOverlay();
window.showLevelUpOverlay = (level) => uiController.showLevelUpOverlay(level);
