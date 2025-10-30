# 🎮 Tetris HyGrid

Juego de Tetris con mecánica de zonas de colores, construido con Three.js y JavaScript modular.

---

## � Inicio Rápido

### Para Jugar AHORA
1. Abre el archivo `index.html` con doble click o desde tu navegador
2. ¡Listo! Presiona cualquier tecla para jugar

### Para Desarrollo

#### Opción 1: Live Server (Recomendado)
1. Abre VS Code en esta carpeta
2. Instala extensión "Live Server"
3. Click derecho en `index.html` → "Open with Live Server"

#### Opción 2: Python Server
```bash
python3 -m http.server 8000
```
Luego abre: http://localhost:8000

#### Opción 3: Node.js
```bash
npx http-server
```

---

## 🎯 Controles

- **← →** = Mover pieza izquierda/derecha
- **↓** = Bajar rápido
- **↑ / Espacio** = Rotar pieza
- **Q** = Modo amarillo (debug)
- **Cualquier tecla** = Iniciar juego desde pantalla IDLE

---

## 🎮 Mecánica del Juego

### Objetivo
Colocar las piezas de colores en sus zonas correspondientes:
- 🔴 **Zona Roja** (columnas 0-3): Piezas/bloques rojos
- 🔵 **Zona Azul** (columnas 4-7): Piezas/bloques azules
- 🟢 **Zona Verde** (columnas 8-11): Piezas/bloques verdes

### Piezas
- Piezas de 2, 3 y 4 bloques
- Algunas piezas tienen múltiples colores
- Piezas multicolor pueden encajar en diferentes zonas
- Si colocas una pieza en la zona incorrecta, se vuelve **GRIS** y no suma puntos

### Sistema de Puntuación
- **100 puntos** por cada sección completada correctamente
- **Nivel**: Sube cada 10,000 puntos
- **Velocidad**: Aumenta 15% por nivel

### Modo Bonus 🟡
Cada 10,000 puntos se activa durante 5 segundos:
- Todas las piezas se vuelven amarillas
- Puedes colocar cualquier pieza en cualquier zona
- ¡Aprovecha para completar más líneas!

---

## 🎵 Sistema de Audio

### Música
- Música de fondo en formato MIDI
- Se inicia automáticamente al comenzar el juego
- Tempo se ajusta con el nivel

### Efectos de Sonido (8-bit)
- ✅ **Línea completada**: "Truin!" (3 notas ascendentes)
- ⭐ **Entrar en bonus**: Chime brillante
- 💎 **Alcanzar bonus**: Power-up
- 📈 **Subir nivel**: Fanfare
- ⬅️➡️ **Movimiento**: Tonos sutiles ascendentes/descendentes
- ✅ **Pieza correcta**: Toc grave
- ❌ **Pieza incorrecta**: Toc hueco

---

## 📁 Estructura del Proyecto

```
hygrid/
├── index.html              ← HTML principal (refactorizado)
├── README.md               ← Esta documentación
│
├── src/                    ← TODO EL CÓDIGO
│   ├── main.js            ← Punto de entrada
│   │
│   ├── core/              ← Lógica del juego
│   │   ├── App.js
│   │   └── TetrisGame.js
│   │
│   ├── scenes/            ← Escenas 3D
│   │   └── IdleScene.js
│   │
│   ├── managers/          ← Gestores de estado
│   │   └── GameStateManager.js
│   │
│   ├── ui/                ← Controladores UI
│   │   └── UIController.js
│   │
│   ├── audio/             ← Controladores Audio
│   │   └── AudioController.js
│   │
│   └── styles/            ← Estilos CSS
│       ├── main.css
│       ├── ui.css
│       └── overlays.css
│
├── assets/                 ← RECURSOS
│   ├── images/            ← Texturas, logos, SVGs
│   └── audio/             ← Sistema MIDI
│       └── midiplayer/
│
└── docs/                   ← DOCUMENTACIÓN
    └── CHANGELOG.md       ← Historial completo de cambios
```

---

## 🎨 Características Técnicas

### Arquitectura Modular
- ✅ Código organizado en módulos ES6
- ✅ Separación de responsabilidades clara
- ✅ CSS extraído a archivos separados
- ✅ Controladores especializados (UI, Audio)

### Mejoras Visuales
- ✅ Flash de éxito (verde) cuando la pieza se coloca correctamente
- ✅ Flash de error (rojo) cuando la pieza se coloca incorrectamente
- ✅ Overlays profesionales con SVGs
- ✅ Animaciones suaves y pulidas

### Sistema de Estados
1. **IDLE**: Pantalla de inicio con cubos flotantes
2. **INTRO**: Countdown 5-4-3-2-1-GO!
3. **PLAYING**: Juego activo
4. **GAME OVER**: Pantalla final con scoreboard

---

## 📊 Métricas de Refactorización

| Métrica | Antes | Ahora | Mejora |
|---------|-------|-------|--------|
| **Líneas en index.html** | 1062 | 145 | **-86%** |
| **CSS embebido** | 600+ líneas | 0 | **-100%** |
| **JS embebido** | 400+ líneas | 50 | **-87%** |
| **Archivos CSS** | 0 | 3 | +3 módulos |
| **Controladores JS** | 0 | 2 | +2 clases |

---

## 🔧 Tecnologías Utilizadas

- **Three.js** - Motor 3D
- **Web Audio API** - Sistema de audio
- **MIDI Player** - Música de fondo
- **ES6 Modules** - Arquitectura modular
- **CSS3** - Animaciones y estilos

---

## 📝 Historial de Cambios

Ver archivo completo en `docs/CHANGELOG.md`

### Versión Actual
- ✅ Sistema de colores por zonas
- ✅ Modo bonus amarillo completo
- ✅ Sistema de audio MIDI + SFX
- ✅ Refactorización HTML/CSS completada
- ✅ Controladores modulares (UI/Audio)
- ✅ Efectos visuales (flashes, overlays)

---

## 🎯 Verificación del Proyecto

**Código completamente organizado:**
- ✅ `src/main.js` - Entry point
- ✅ `src/core/` - Lógica principal del juego
- ✅ `src/scenes/` - Escenas 3D
- ✅ `src/managers/` - Gestores de estado
- ✅ `src/ui/` - Controladores de interfaz
- ✅ `src/audio/` - Controladores de audio
- ✅ `src/styles/` - Estilos CSS separados

**Solo excepción:** `assets/audio/midiplayer/*.js` (librerías MIDI externas)

---

**¡Diviértete!** 🎮✨

- ✅ **Sistema de Niveles**: Aumenta velocidad con el puntaje- **Modo Bonus**: Se activa cada 10000 puntos durante 5 segundos

- ✅ **Escena Idle**: Cubos flotantes animados

- ✅ **Música MIDI**: Soundtrack dinámico con aceleración por nivel### Modo Bonus 🟡

- ✅ **Efectos Visuales**: Flashes de éxito/error, animaciones suavesCuando alcanzas cada 10000 puntos:

- ✅ **Scoreboard**: Historial de mejores puntajes (localStorage)- Todas las piezas se vuelven amarillas

- Puedes colocar cualquier pieza en cualquier zona

## 🎮 Controles- Dura 5 segundos

- ¡Aprovecha para completar más líneas!

| Tecla | Acción |

|-------|--------|## 📁 Estructura de archivos

| ← → | Mover pieza horizontal |

| ↓ | Mover pieza hacia abajo |```

| ↑ / Espacio | Rotar pieza |/clean/

| Q | Activar modo amarillo (debug) |├── index.html              # Archivo principal (ABRE ESTE)

| Cualquier tecla | Iniciar juego (desde idle) |├── game.js                 # Lógica del juego con Three.js

├── union-logo-outline.svg  # Logo base

## 🎨 Zonas de Color├── union-logo-filled.svg   # Logo con color

└── midiplayer/             # Reproductor de música MIDI

- **Roja** (columnas 0-3): Piezas rojas    ├── dance.mid

- **Azul** (columnas 4-7): Piezas azules      ├── MIDIFile.js

- **Verde** (columnas 8-11): Piezas verdes    ├── MIDIPlayer.js

    └── WebAudioFontPlayer.js

## 💯 Sistema de Puntuación```



- **100 puntos** por cada bloque colocado correctamente## 🎵 Audio

- **500 puntos** por cada línea completa eliminada

- **Power-up** cada 10,000 puntos### Música

- **Nivel up** cada 3,000 puntos- Música de fondo en formato MIDI

- Se inicia automáticamente al comenzar el juego

## 🛠️ Tecnologías- Tempo se ajusta con el nivel



- **Three.js**: Motor 3D### Efectos de sonido (8-bit)

- **JavaScript ES6+**: Módulos y clases- ✅ Completar línea: "Truin!" (3 notas ascendentes)

- **Web Audio API**: Sistema MIDI- ⭐ Entrar en bonus: Chime brillante

- **localStorage**: Persistencia de puntajes- 💎 Alcanzar bonus: Power-up

- 📈 Subir nivel: Fanfare

## 📖 Documentación

## 🖥️ Estados del juego

- [Estructura del Proyecto](docs/ESTRUCTURA.md)

- [Historia de Refactorización](docs/REFACTORIZACION.md)1. **IDLE**: Pantalla de inicio

   - Presiona cualquier tecla para jugar

## 🔧 Desarrollo   - Muestra scoreboard cada 10 segundos



### Requisitos2. **INTRO**: Countdown 5-4-3-2-1-GO!

- Navegador moderno con soporte ES6 modules

- Servidor web local (Live Server, http-server, etc.)3. **PLAYING**: Juego activo

   - Header con nivel y zonas

### Extensiones Recomendadas (VS Code)   - Footer con puntuación y logo

- Live Server   - Indicador de bonus cuando está activo

- ESLint

- Prettier4. **GAME OVER**: Pantalla final

   - Muestra puntuación y líneas

### Debugging   - Guarda en scoreboard

```javascript   - Vuelve a IDLE después de 5 segundos

// La aplicación expone variables globales para debug:

window.tetrisGame        // Instancia del juego## 🏆 Scoreboard

window.idleScene         // Escena idle

window.gameStateManager  // Gestor de estados- Se guardan los últimos 10 puntajes

```- Almacenado en localStorage del navegador

- Se muestra automáticamente cada 10 segundos en IDLE

## 📝 Notas Técnicas- Ordenado de mayor a menor puntaje



### Arquitectura Modular## ⚙️ Tecnologías

El código está organizado en módulos ES6 con imports/exports:

- `src/core/`: Lógica principal- **Three.js** (desde CDN): Motor 3D

- `src/scenes/`: Escenas 3D independientes- **Vanilla JavaScript**: Lógica del juego

- `src/managers/`: Gestores de estado y flujo- **Web Audio API**: Efectos de sonido

- **MIDI Player**: Música de fondo

### Sistema de Coordenadas- **LocalStorage**: Guardar puntajes

- **Board**: 12x20 (ancho x alto)

- **World**: Sistema de coordenadas Three.js centrado## 🎨 Diseño

- **Offset Y**: -3.5 para alinear con footer

Todos los colores y diseño son idénticos al original:

### Renderizado- Amarillo: `#dcee2d`

- Cámara ortográfica para vista 2D isométrica- Rojo: `#cf4526`

- Cubos con wireframe de cilindros- Azul: `#21b1f8`

- Texturas PNG para el interior- Verde: `#47ebcd`

- Iluminación ambiental y direccional- Gris: `#656565`



## 🎯 Roadmap## 🐛 Solución de problemas



- [ ] Más tipos de piezas### El juego no carga

- [ ] Partículas en eliminación de líneas- Asegúrate de abrir `/clean/index.html` (no el root del proyecto)

- [ ] Modo multijugador- Usa Live Server o un servidor HTTP local

- [ ] Personalización de controles- Verifica que tienes conexión a internet (Three.js se carga desde CDN)

- [ ] Más canciones MIDI

- [ ] Sistema de achievements### No se ve el logo

- Los archivos SVG deben estar en la misma carpeta que index.html

## 👥 Créditos- Verifica que `union-logo-outline.svg` y `union-logo-filled.svg` existen



Desarrollado con ❤️ por el equipo HyGrid### No hay música

- La música se carga desde `./midiplayer/dance.mid`

## 📄 Licencia- Asegúrate de que la carpeta `midiplayer` está completa

- Haz click en la página para activar el AudioContext (requerimiento del navegador)

[Agregar licencia aquí]

### Errores de CORS

---- No abras el archivo directamente (file://)

- Usa Live Server o un servidor HTTP local

**¡Diviértete jugando!** 🎮✨

## 📝 Notas

- El juego se escala automáticamente para adaptarse a cualquier tamaño de ventana
- Proporción fija: 1600 (formato vertical)
- Totalmente funcional sin dependencias externas (excepto Three.js desde CDN)
- No requiere build ni compilación

¡Disfruta del juego! 🎮✨
