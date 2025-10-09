// ==================== AUDIO CONTROLLER ====================
// Maneja MIDI player y efectos de sonido

export class AudioController {
  constructor() {
    this.midiPlayer = null;
    this.musicStarted = false;
    this.musicTempo = 1.0;
    this.sfxAudioContext = null;
    this.parsedSong = null;
    this.pendingStart = false;
    this.musicMuted = false;
    
    this.initMIDIPlayer();
    this.initSFXContext();

    // Keybinding: toggle music mute (M)
    this._handleKeydown = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        this.toggleMusicMute();
      }
    };
    document.addEventListener('keydown', this._handleKeydown);
  }

  // === MIDI PLAYER ===
  initMIDIPlayer() {
    // Esperar a que MIDIPlayer esté disponible
    if (typeof MIDIPlayer === 'undefined') {
      console.warn('⚠️ MIDIPlayer aún no disponible, reintentando...');
      setTimeout(() => this.initMIDIPlayer(), 100);
      return;
    }

    try {
      this.midiPlayer = new MIDIPlayer();
      // Hook onload from MIDIPlayer: será llamado cuando loadSong termine
      try {
        this.midiPlayer.onload = (song) => {
          console.log('✅ MIDIPlayer.onload: carga completa');
          // Establecer volumen suave al cargar
          this.setMusicVolume(35); // 35% del volumen original (+10% más alto)
          // Si se pidió iniciar música antes de que terminara la carga
          if (this.pendingStart) {
            if (typeof this.midiPlayer.play === 'function') {
              this.midiPlayer.play();
              this.musicStarted = true;
              this.pendingStart = false;
              console.log('▶️ Música iniciada automáticamente tras load');
            }
          }
        };
      } catch (e) {
        console.warn('⚠️ No se pudo asignar onload al MIDIPlayer', e);
      }
      
      const request = new XMLHttpRequest();
      request.open('GET', './assets/audio/midiplayer/dance.mid', true);
      request.responseType = 'arraybuffer';
      
      request.onload = () => {
        try {
          const arrayBuffer = request.response;
          const midiFile = new MIDIFile(arrayBuffer);
          const song = midiFile.parseSong();
          // Guardar song para uso futuro y usar la API del MIDIPlayer presente
          this.parsedSong = song;

          // Iniciar la carga de instrumentos / samples mediante la API real
          if (typeof this.midiPlayer.startLoad === 'function') {
            try {
              this.midiPlayer.startLoad(song);
              // Usar autoReplay como equivalente a loop
              this.midiPlayer.autoReplay = true;
              console.log('✅ MIDI parseado y startLoad() llamado');
            } catch (err) {
              console.error('❌ Error iniciando startLoad en MIDIPlayer:', err);
            }
          } else {
            // Fallback: asignar song directamente (no ideal)
            this.midiPlayer.song = song;
            console.log('⚠️ MIDIPlayer.startLoad no disponible, song asignado directamente');
          }
        } catch (error) {
          console.error('❌ Error parseando MIDI:', error);
        }
      };
      
      request.onerror = () => {
        console.error('❌ Error cargando archivo MIDI');
      };
      
      request.send();
      
    } catch (error) {
      console.error('❌ Error inicializando MIDI Player:', error);
    }
  }

  startMusic() {
    if (!this.midiPlayer) {
      console.warn('⚠️ MIDIPlayer no inicializado');
      return;
    }

    // Si está muteado, difiere el inicio hasta que se desmutee
    if (this.musicMuted) {
      this.pendingStart = true;
      console.log('🔇 Música muteada: inicio diferido');
      return;
    }

    if (this.musicStarted) {
      if (typeof this.midiPlayer.resume === 'function') {
        this.midiPlayer.resume();
        console.log('▶️ Música resumida');
      } else {
        console.log('▶️ Música ya iniciada (resume no disponible)');
      }
      return;
    }

    // Si ya se cargó la canción en el player, pedir play()
    try {
      const loaded = (typeof this.midiPlayer.getCurrentSong === 'function') ? this.midiPlayer.getCurrentSong() : null;
      if (loaded) {
        if (typeof this.midiPlayer.play === 'function') {
          this.setMusicVolume(35); // Asegurar volumen suave
          this.midiPlayer.play();
          this.musicStarted = true;
          console.log('▶️ Música iniciada (play)');
          return;
        }
      }

      // Si no está cargada todavía, marcar pendingStart y asegurarse de que la carga esté en marcha
      this.pendingStart = true;
      if (this.parsedSong && typeof this.midiPlayer.startLoad === 'function') {
        try {
          this.midiPlayer.startLoad(this.parsedSong);
          console.log('⏳ Música pendiente: startLoad() (esperando load)');
        } catch (err) {
          console.error('❌ Error al llamar startLoad en startMusic():', err);
        }
      } else {
        console.log('⏳ Música pendiente: esperando que se complete la carga');
      }
    } catch (error) {
      console.error('❌ Error iniciando música:', error);
    }
  }

  pauseMusic() {
    if (!this.midiPlayer || !this.musicStarted) return;
    
    try {
      this.midiPlayer.pause();
      console.log('⏸️ Música pausada');
    } catch (error) {
      console.error('❌ Error pausando música:', error);
    }
  }

  stopMusic() {
    if (!this.midiPlayer || !this.musicStarted) return;
    
    try {
      this.midiPlayer.stop();
      this.musicStarted = false;
      console.log('⏹️ Música detenida');
    } catch (error) {
      console.error('❌ Error deteniendo música:', error);
    }
  }

  setMusicTempo(tempo) {
    this.musicTempo = tempo;
    
    if (!this.midiPlayer || !this.musicStarted) return;
    
    try {
      this.midiPlayer.setTempo(tempo);
      console.log(`🎵 Tempo cambiado a ${tempo}x`);
    } catch (error) {
      console.error('❌ Error cambiando tempo:', error);
    }
  }

  setMusicVolume(volume) {
    if (!this.midiPlayer) return;
    
    try {
      // Establecer volumen más suave para todos los tracks
      if (typeof this.midiPlayer.setVolume === 'function') {
        // Iterar por todos los tracks disponibles (típicamente 0-15)
        for (let track = 0; track < 16; track++) {
          this.midiPlayer.setVolume(volume, track);
        }
        console.log(`🔊 Volumen de música ajustado a ${volume}%`);
      }
    } catch (error) {
      console.error('❌ Error ajustando volumen:', error);
    }
  }

  resetMusicTempo() {
    this.setMusicTempo(1.0);
  }

  // === MUSIC MUTE TOGGLE ===
  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    window.musicMuted = this.musicMuted;
    if (this.musicMuted) {
      // Pausar música; los SFX permanecen activos
      this.pauseMusic();
      console.log('🔇 Música muteada (SFX activos). Pulsa M para activar.');
    } else {
      console.log('🔊 Música activada');
      // Reanudar o iniciar si estaba pendiente
      if (this.musicStarted) {
        if (this.midiPlayer && typeof this.midiPlayer.resume === 'function') {
          try { this.midiPlayer.resume(); } catch {}
        } else if (this.midiPlayer && typeof this.midiPlayer.play === 'function') {
          try { this.midiPlayer.play(); this.musicStarted = true; } catch {}
        }
      } else if (this.pendingStart || this.parsedSong) {
        // Forzar inicio si había intención previa o ya hay song
        try { this.startMusic(); } catch {}
      }
    }
  }

  // === EFECTOS DE SONIDO ===
  initSFXContext() {
    try {
      const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
      this.sfxAudioContext = new AudioContextFunc();
      console.log('✅ AudioContext para SFX inicializado');
    } catch (error) {
      console.error('❌ Error inicializando AudioContext para SFX:', error);
    }
  }

  play8bitNote(frequency, duration, startTime, type = 'square', volume = 0.5) {
    if (!this.sfxAudioContext) return;
    
    const oscillator = this.sfxAudioContext.createOscillator();
    const gainNode = this.sfxAudioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxAudioContext.destination);
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  playLineClearSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.1, now, 'square', 0.3);
    this.play8bitNote(659.25, 0.1, now + 0.1, 'square', 0.3);
    this.play8bitNote(783.99, 0.15, now + 0.2, 'square', 0.3);
  }

  playBonusSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.08, now, 'triangle', 0.35);
    this.play8bitNote(659.25, 0.08, now + 0.08, 'triangle', 0.35);
    this.play8bitNote(783.99, 0.08, now + 0.16, 'triangle', 0.35);
    this.play8bitNote(1046.50, 0.2, now + 0.24, 'triangle', 0.35);
  }

  playEnterBonusSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(1046.50, 0.1, now, 'sine', 0.4);
    this.play8bitNote(1318.51, 0.15, now + 0.1, 'sine', 0.4);
  }

  playLevelUpSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.1, now, 'square', 0.35);
    this.play8bitNote(659.25, 0.1, now + 0.1, 'square', 0.35);
    this.play8bitNote(783.99, 0.1, now + 0.2, 'square', 0.35);
    this.play8bitNote(1046.50, 0.2, now + 0.3, 'square', 0.35);
  }

  playCorrectPieceSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(110.00, 0.04, now, 'sawtooth', 0.25);
    this.play8bitNote(220.00, 0.03, now + 0.02, 'sawtooth', 0.25);
  }

  playIncorrectPieceSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(82.41, 0.06, now, 'sawtooth', 0.25);
    this.play8bitNote(110.00, 0.05, now + 0.04, 'sawtooth', 0.25);
  }

  playMoveLeftSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    // Sonido sutil descendente para movimiento izquierda
    this.play8bitNote(440.00, 0.02, now, 'sine', 0.15);
    this.play8bitNote(392.00, 0.02, now + 0.015, 'sine', 0.12);
  }

  playMoveRightSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    // Sonido sutil ascendente para movimiento derecha
    this.play8bitNote(392.00, 0.02, now, 'sine', 0.15);
    this.play8bitNote(440.00, 0.02, now + 0.015, 'sine', 0.12);
  }

  playGameStartSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    // Secuencia ascendente retro que representa "¡Comenzar!"
    this.play8bitNote(261.63, 0.08, now, 'square', 0.4);      // C4
    this.play8bitNote(329.63, 0.08, now + 0.08, 'square', 0.4); // E4
    this.play8bitNote(392.00, 0.08, now + 0.16, 'square', 0.4); // G4
    this.play8bitNote(523.25, 0.15, now + 0.24, 'square', 0.5); // C5 - nota final más larga y fuerte
  }

  debugMIDI() {
    console.log('=== MIDI DEBUG ===');
    console.log('MIDIPlayer exists:', typeof MIDIPlayer !== 'undefined');
    console.log('midiPlayer instance:', this.midiPlayer);
    console.log('Music started:', this.musicStarted);
    console.log('Current tempo:', this.musicTempo);
    
    if (this.midiPlayer) {
      console.log('Player state:', {
        hasStartLoad: typeof this.midiPlayer.startLoad === 'function',
        hasPlay: typeof this.midiPlayer.play === 'function',
        isPlaying: this.midiPlayer.isPlaying ? this.midiPlayer.isPlaying() : 'unknown',
        songLoaded: !!(this.midiPlayer && (this.midiPlayer.getCurrentSong ? this.midiPlayer.getCurrentSong() : this.midiPlayer.song)),
        parsedSongAvailable: !!this.parsedSong,
        pendingStart: !!this.pendingStart
      });
      try {
        console.log('loader present:', !!(this.midiPlayer && this.midiPlayer.getContext ? 'yes' : (this.midiPlayer && this.midiPlayer.loader ? 'yes' : 'no')));
      } catch (e) {
        // ignore
      }
    }
  }
}

// Crear instancia global
const audioController = new AudioController();

// Exportar funciones globales para compatibilidad
window.startMusic = () => audioController.startMusic();
window.pauseMusic = () => audioController.pauseMusic();
window.stopMusic = () => audioController.stopMusic();
window.setMusicTempo = (tempo) => audioController.setMusicTempo(tempo);
window.resetMusicTempo = () => audioController.resetMusicTempo();
window.setMusicVolume = (volume) => audioController.setMusicVolume(volume);
window.toggleMusicMute = () => audioController.toggleMusicMute();
window.isMusicMuted = () => !!audioController.musicMuted;
window.playLineClearSFX = () => audioController.playLineClearSFX();
window.playBonusSFX = () => audioController.playBonusSFX();
window.playEnterBonusSFX = () => audioController.playEnterBonusSFX();
window.playLevelUpSFX = () => audioController.playLevelUpSFX();
window.playCorrectPieceSFX = () => audioController.playCorrectPieceSFX();
window.playIncorrectPieceSFX = () => audioController.playIncorrectPieceSFX();
window.playMoveLeftSFX = () => audioController.playMoveLeftSFX();
window.playMoveRightSFX = () => audioController.playMoveRightSFX();
window.playGameStartSFX = () => audioController.playGameStartSFX();
window.debugMIDI = () => audioController.debugMIDI();

// Debug automático
setTimeout(() => {
  console.log('🎵 Auto-debug MIDI después de 2 segundos:');
  audioController.debugMIDI();
}, 2000);
