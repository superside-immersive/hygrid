# 🎮 Tetris HyGrid# 🎮 Tetris Game - Versión Standalone con Three.js



Juego de Tetris con mecánica de zonas de colores, construido con Three.js y JavaScript modular.## 📋 Descripción

Versión completamente autónoma del juego de Tetris usando Three.js puro (sin Needle Engine).

## 🚀 Inicio Rápido

## 🚀 Cómo ejecutar

1. **Abrir el proyecto:**

   ```bash### Opción 1: Live Server (VS Code)

   cd /Users/mpalenque/tetrisclean/clean1. Abre VS Code

   ```2. Abre el archivo: `/clean/index.html`

3. Click derecho → "Open with Live Server"

2. **Abrir con Live Server:**4. El juego se abrirá en tu navegador

   - Abre `index.html` en tu navegador, o

   - Usa Live Server de VS Code para desarrollo### Opción 2: Navegador directo

1. Navega a la carpeta `/clean`

3. **¡Jugar!**2. Abre `index.html` directamente en tu navegador

   - Presiona cualquier tecla para comenzar3. ⚠️ **IMPORTANTE**: Algunos navegadores bloquean módulos ES6 por seguridad. Si ves errores de CORS, usa Live Server.

   - Flechas para mover piezas

   - Flecha arriba o Espacio para rotar### Opción 3: Servidor HTTP simple

   - Q para activar modo amarillo (debug)```bash

cd /Users/mpalenque/Desktop/Unitytetris/Needle/newProject/clean

## 📁 Estructura del Proyectopython3 -m http.server 8000

```

```Luego abre: http://localhost:8000

clean/

├── src/main.js                # Punto de entrada## 🎯 Controles

├── index.html                 # HTML principal

│- **⬅️ Flecha izquierda**: Mover pieza a la izquierda

├── src/                       # Código fuente- **➡️ Flecha derecha**: Mover pieza a la derecha

│   ├── core/                  # Clases principales- **⬇️ Flecha abajo**: Acelerar caída

│   │   ├── App.js            # Aplicación THREE.js- **⬆️ Flecha arriba / Espacio**: Rotar pieza

│   │   └── TetrisGame.js     # Lógica del juego- **Cualquier tecla**: Iniciar juego desde pantalla IDLE

│   ├── scenes/                # Escenas 3D

│   │   └── IdleScene.js      # Escena idle## 🎮 Mecánica del juego

│   └── managers/              # Gestores

│       └── GameStateManager.js### Objetivo

│Colocar las piezas de colores en sus zonas correspondientes:

├── assets/                    # Recursos- 🔴 **Zona Roja** (columnas 0-3): Piezas/bloques rojos

│   ├── images/               # Texturas e imágenes- 🔵 **Zona Azul** (columnas 4-7): Piezas/bloques azules

│   └── audio/                # Sistema MIDI- 🟢 **Zona Verde** (columnas 8-11): Piezas/bloques verdes

│

└── docs/                      # Documentación### Piezas

    ├── ESTRUCTURA.md         # Estructura detallada- Piezas de 2, 3 y 4 bloques

    └── REFACTORIZACION.md    # Historia de refactorización- Algunas piezas tienen múltiples colores

```- Piezas multicolor pueden encajar en diferentes zonas



## 🎯 Características### Sistema de puntuación

- **100 puntos** por cada sección completada correctamente

- ✅ **Sistema de Zonas de Colores**: Coloca piezas rojas, azules y verdes en sus zonas- **Nivel**: Sube cada 10000 puntos

- ✅ **Modo Power-Up Amarillo**: Cada 10,000 puntos, todas las piezas aceptadas- **Velocidad**: Aumenta 15% por nivel

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
- Proporción fija: 1166x1920 (formato vertical)
- Totalmente funcional sin dependencias externas (excepto Three.js desde CDN)
- No requiere build ni compilación

¡Disfruta del juego! 🎮✨
