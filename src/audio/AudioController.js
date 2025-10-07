// ==================== AUDIO CONTROLLER ====================
// Maneja MIDI player y efectos de sonido

export class AudioController {
  constructor() {
    this.midiPlayer = null;
    this.musicStarted = false;
    this.musicTempo = 1.0;
    this.sfxAudioContext = null;
    
    this.initMIDIPlayer();
    this.initSFXContext();
  }

  // === MIDI PLAYER ===
  initMIDIPlayer() {
    try {
      if (typeof MIDIPlayer === 'undefined') {
        console.warn('⚠️ MIDIPlayer no disponible');
        return;
      }

      this.midiPlayer = new MIDIPlayer();
      
      const request = new XMLHttpRequest();
      request.open('GET', './assets/audio/midiplayer/dance.mid', true);
      request.responseType = 'arraybuffer';
      
      request.onload = () => {
        try {
          const arrayBuffer = request.response;
          const midiFile = new MIDIFile(arrayBuffer);
          const song = midiFile.parseSong();
          
          this.midiPlayer.setSong(song);
          this.midiPlayer.loadPlugin(1, '_tone_0000_JCLive_sf2_file');
          this.midiPlayer.loop(true);
          
          console.log('✅ MIDI cargado correctamente');
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

    if (this.musicStarted) {
      this.midiPlayer.resume();
      console.log('▶️ Música resumida');
    } else {
      try {
        this.midiPlayer.startLoad();
        this.midiPlayer.startPlay();
        this.musicStarted = true;
        console.log('▶️ Música iniciada');
      } catch (error) {
        console.error('❌ Error iniciando música:', error);
      }
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

  resetMusicTempo() {
    this.setMusicTempo(1.0);
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

  play8bitNote(frequency, duration, startTime, type = 'square') {
    if (!this.sfxAudioContext) return;
    
    const oscillator = this.sfxAudioContext.createOscillator();
    const gainNode = this.sfxAudioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxAudioContext.destination);
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  playLineClearSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.1, now, 'square');
    this.play8bitNote(659.25, 0.1, now + 0.1, 'square');
    this.play8bitNote(783.99, 0.15, now + 0.2, 'square');
  }

  playBonusSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.08, now, 'triangle');
    this.play8bitNote(659.25, 0.08, now + 0.08, 'triangle');
    this.play8bitNote(783.99, 0.08, now + 0.16, 'triangle');
    this.play8bitNote(1046.50, 0.2, now + 0.24, 'triangle');
  }

  playEnterBonusSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(1046.50, 0.1, now, 'sine');
    this.play8bitNote(1318.51, 0.15, now + 0.1, 'sine');
  }

  playLevelUpSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(523.25, 0.1, now, 'square');
    this.play8bitNote(659.25, 0.1, now + 0.1, 'square');
    this.play8bitNote(783.99, 0.1, now + 0.2, 'square');
    this.play8bitNote(1046.50, 0.2, now + 0.3, 'square');
  }

  playCorrectPieceSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(110.00, 0.04, now, 'sawtooth');
    this.play8bitNote(220.00, 0.03, now + 0.02, 'sawtooth');
  }

  playIncorrectPieceSFX() {
    if (!this.sfxAudioContext) return;
    const now = this.sfxAudioContext.currentTime;
    this.play8bitNote(82.41, 0.06, now, 'sawtooth');
    this.play8bitNote(110.00, 0.05, now + 0.04, 'sawtooth');
  }

  debugMIDI() {
    console.log('=== MIDI DEBUG ===');
    console.log('MIDIPlayer exists:', typeof MIDIPlayer !== 'undefined');
    console.log('midiPlayer instance:', this.midiPlayer);
    console.log('Music started:', this.musicStarted);
    console.log('Current tempo:', this.musicTempo);
    
    if (this.midiPlayer) {
      console.log('Player state:', {
        isPlaying: this.midiPlayer.isPlaying ? this.midiPlayer.isPlaying() : 'unknown',
        song: this.midiPlayer.song ? 'loaded' : 'not loaded'
      });
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
window.playLineClearSFX = () => audioController.playLineClearSFX();
window.playBonusSFX = () => audioController.playBonusSFX();
window.playEnterBonusSFX = () => audioController.playEnterBonusSFX();
window.playLevelUpSFX = () => audioController.playLevelUpSFX();
window.playCorrectPieceSFX = () => audioController.playCorrectPieceSFX();
window.playIncorrectPieceSFX = () => audioController.playIncorrectPieceSFX();
window.debugMIDI = () => audioController.debugMIDI();

// Debug automático
setTimeout(() => {
  console.log('🎵 Auto-debug MIDI después de 2 segundos:');
  audioController.debugMIDI();
}, 2000);
