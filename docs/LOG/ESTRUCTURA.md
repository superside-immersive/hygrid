# 📁 Estructura de Carpetas - Tetris Game

## 🎯 Nueva Organización

La aplicación ahora está organizada en una estructura modular profesional:

```
clean/
├── index.html                    # Archivo HTML principal
├── README.md                     # Documentación principal
│
├── src/                          # Código fuente
│   ├── main.js                   # Punto de entrada de la aplicación
│   ├── core/                     # Clases principales
│   │   ├── App.js               # Aplicación principal (THREE.js setup)
│   │   └── TetrisGame.js        # Lógica del juego Tetris
│   │
│   ├── scenes/                   # Escenas 3D
│   │   └── IdleScene.js         # Escena de cubos flotantes
│   │
│   └── managers/                 # Gestores del juego
│       └── GameStateManager.js   # Estados del juego (idle, intro, playing, etc.)
│
├── assets/                       # Recursos del juego
│   ├── images/                   # Imágenes y texturas
│   │   ├── cube.png             # Textura de cubos
│   │   ├── logo.png             # Logo principal
│   │   ├── union-logo-full.svg
│   │   ├── union-logo-filled.svg
│   │   └── union-logo-outline.svg
│   │
│   └── audio/                    # Audio y música
│       └── midiplayer/          # Sistema MIDI
│           ├── dance.mid
│           ├── MIDIFile.js
│           ├── MIDIPlayer.js
│           └── WebAudioFontPlayer.js
│
└── docs/                         # Documentación
   └── LOG/                     # Historial y respaldos
```

## 📦 Estructura de Módulos

### 1. **src/main.js** (Punto de Entrada)
```javascript
import { App } from './core/App.js';
new App();
```
- Archivo simple que inicia toda la aplicación
- Único punto de entrada importado por `index.html`

### 2. **src/core/App.js** (Aplicación Principal)
```javascript
import { TetrisGame } from './TetrisGame.js';
import { IdleScene } from '../scenes/IdleScene.js';
import { GameStateManager } from '../managers/GameStateManager.js';
```
- Configura THREE.js (scene, camera, renderer, lights)
- Orquesta todas las clases principales
- Maneja el loop de animación principal

### 3. **src/core/TetrisGame.js** (Lógica del Juego)
- Sistema de tablero y piezas
- Detección de colisiones
- Sistema de puntuación y niveles
- Modo power-up amarillo
- Efectos visuales

### 4. **src/scenes/IdleScene.js** (Escena Idle)
- Cubos flotantes animados
- Sistema de grilla 3D
- Efectos de cámara

### 5. **src/managers/GameStateManager.js** (Estados)
- Máquina de estados (idle → intro → playing → gameover)
- Sistema de scoreboard
- Transiciones entre pantallas

## 🔗 Sistema de Imports

### Rutas Relativas:
- `src/main.js` → `./core/App.js`
- `App.js` → `./TetrisGame.js` (mismo directorio)
- `App.js` → `../scenes/IdleScene.js` (subir y bajar)
- `App.js` → `../managers/GameStateManager.js` (subir y bajar)

### Rutas de Assets:
- Texturas: `../../assets/images/cube.png`
- Imágenes HTML: `assets/images/logo.png`
- Audio: `./assets/audio/midiplayer/dance.mid`
- Scripts MIDI: `./assets/audio/midiplayer/MIDIPlayer.js`

## ✅ Ventajas de Esta Estructura

### 1. **Separación de Responsabilidades**
- **core/**: Lógica principal del juego
- **scenes/**: Escenas 3D independientes
- **managers/**: Gestores de estado y flujo
- **assets/**: Recursos separados del código

### 2. **Fácil Navegación**
- Encuentra rápidamente lo que buscas
- Nombres de carpetas descriptivos
- Jerarquía clara y lógica

### 3. **Escalabilidad**
```
src/
├── core/
│   ├── App.js
│   ├── TetrisGame.js
│   └── PieceFactory.js        ← Fácil agregar más
├── scenes/
│   ├── IdleScene.js
│   └── GameScene.js           ← Nuevas escenas
├── managers/
│   ├── GameStateManager.js
│   ├── ScoreManager.js        ← Nuevos managers
│   └── AudioManager.js
└── utils/                      ← Nueva carpeta de utilidades
    ├── constants.js
    └── helpers.js
```

### 4. **Mantenimiento**
- Archivos más pequeños y enfocados
- Cambios localizados (no afectan todo)
- Testing más fácil por módulos

### 5. **Colaboración**
- Varios desarrolladores pueden trabajar sin conflictos
- Git diffs más claros
- Code reviews más efectivos

## 🚀 Migración desde Versión Anterior

### Antes:
```html
<script type="module" src="./game.js"></script>
```

### Ahora:
```html
<script type="module" src="./src/main.js"></script>
```

## 📋 Checklist de Verificación

- ✅ `src/main.js` importa correctamente desde `src/core/App.js`
- ✅ `App.js` importa desde `src/core/`, `src/scenes/`, `src/managers/`
- ✅ Texturas cargan desde `assets/images/`
- ✅ Audio MIDI carga desde `assets/audio/midiplayer/`
- ✅ Imágenes del HTML cargan desde `assets/images/`
- ✅ Scripts MIDI cargan desde `assets/audio/midiplayer/`
- ✅ index.html apunta a `src/main.js`

## 🎯 Próximas Mejoras Sugeridas

1. **Crear constants.js**
   - Colores, dimensiones, configuraciones
   - Centralizar valores mágicos

2. **Crear PieceFactory.js**
   - Separar definición de piezas
   - Facilitar agregar nuevas piezas

3. **Crear AudioManager.js**
   - Encapsular toda la lógica MIDI
   - Simplificar el HTML

4. **Agregar utils/**
   - Funciones auxiliares reutilizables
   - Helpers matemáticos

5. **Considerar types/ o interfaces/**
   - Si decides usar TypeScript más adelante
   - Documentación de tipos

## 💡 Tips de Desarrollo

### Abrir en VS Code:
```bash
cd /Users/mpalenque/tetrisclean/clean
code .
```

### Live Server:
- Instala extensión "Live Server" en VS Code
- Click derecho en `index.html` → "Open with Live Server"

### Debug:
- Errores 404: Verifica rutas relativas
- Errores de import: Verifica extensión `.js` en imports
- Texturas no cargan: Verifica rutas desde el módulo actual

## 📞 Soporte

¿Problemas con las rutas?
1. Verifica la consola del navegador
2. Revisa rutas relativas en imports
3. Confirma que assets/ está en el lugar correcto
4. Usa DevTools → Network para ver qué archivos fallan

---

**¡La aplicación está lista para usarse con la nueva estructura modular!** 🎮✨
