# 🎮 Tetris Game - Versión Standalone con Three.js

## 📋 Descripción
Versión completamente autónoma del juego de Tetris usando Three.js puro (sin Needle Engine).

## 🚀 Cómo ejecutar

### Opción 1: Live Server (VS Code)
1. Abre VS Code
2. Abre el archivo: `/clean/index.html`
3. Click derecho → "Open with Live Server"
4. El juego se abrirá en tu navegador

### Opción 2: Navegador directo
1. Navega a la carpeta `/clean`
2. Abre `index.html` directamente en tu navegador
3. ⚠️ **IMPORTANTE**: Algunos navegadores bloquean módulos ES6 por seguridad. Si ves errores de CORS, usa Live Server.

### Opción 3: Servidor HTTP simple
```bash
cd /Users/mpalenque/Desktop/Unitytetris/Needle/newProject/clean
python3 -m http.server 8000
```
Luego abre: http://localhost:8000

## 🎯 Controles

- **⬅️ Flecha izquierda**: Mover pieza a la izquierda
- **➡️ Flecha derecha**: Mover pieza a la derecha
- **⬇️ Flecha abajo**: Acelerar caída
- **⬆️ Flecha arriba / Espacio**: Rotar pieza
- **Cualquier tecla**: Iniciar juego desde pantalla IDLE

## 🎮 Mecánica del juego

### Objetivo
Colocar las piezas de colores en sus zonas correspondientes:
- 🔴 **Zona Roja** (columnas 0-3): Piezas/bloques rojos
- 🔵 **Zona Azul** (columnas 4-7): Piezas/bloques azules
- 🟢 **Zona Verde** (columnas 8-11): Piezas/bloques verdes

### Piezas
- Piezas de 2, 3 y 4 bloques
- Algunas piezas tienen múltiples colores
- Piezas multicolor pueden encajar en diferentes zonas

### Sistema de puntuación
- **100 puntos** por cada sección completada correctamente
- **Nivel**: Sube cada 10000 puntos
- **Velocidad**: Aumenta 15% por nivel
- **Modo Bonus**: Se activa cada 10000 puntos durante 5 segundos

### Modo Bonus 🟡
Cuando alcanzas cada 10000 puntos:
- Todas las piezas se vuelven amarillas
- Puedes colocar cualquier pieza en cualquier zona
- Dura 5 segundos
- ¡Aprovecha para completar más líneas!

## 📁 Estructura de archivos

```
/clean/
├── index.html              # Archivo principal (ABRE ESTE)
├── game.js                 # Lógica del juego con Three.js
├── union-logo-outline.svg  # Logo base
├── union-logo-filled.svg   # Logo con color
└── midiplayer/             # Reproductor de música MIDI
    ├── dance.mid
    ├── MIDIFile.js
    ├── MIDIPlayer.js
    └── WebAudioFontPlayer.js
```

## 🎵 Audio

### Música
- Música de fondo en formato MIDI
- Se inicia automáticamente al comenzar el juego
- Tempo se ajusta con el nivel

### Efectos de sonido (8-bit)
- ✅ Completar línea: "Truin!" (3 notas ascendentes)
- ⭐ Entrar en bonus: Chime brillante
- 💎 Alcanzar bonus: Power-up
- 📈 Subir nivel: Fanfare

## 🖥️ Estados del juego

1. **IDLE**: Pantalla de inicio
   - Presiona cualquier tecla para jugar
   - Muestra scoreboard cada 10 segundos

2. **INTRO**: Countdown 5-4-3-2-1-GO!

3. **PLAYING**: Juego activo
   - Header con nivel y zonas
   - Footer con puntuación y logo
   - Indicador de bonus cuando está activo

4. **GAME OVER**: Pantalla final
   - Muestra puntuación y líneas
   - Guarda en scoreboard
   - Vuelve a IDLE después de 5 segundos

## 🏆 Scoreboard

- Se guardan los últimos 10 puntajes
- Almacenado en localStorage del navegador
- Se muestra automáticamente cada 10 segundos en IDLE
- Ordenado de mayor a menor puntaje

## ⚙️ Tecnologías

- **Three.js** (desde CDN): Motor 3D
- **Vanilla JavaScript**: Lógica del juego
- **Web Audio API**: Efectos de sonido
- **MIDI Player**: Música de fondo
- **LocalStorage**: Guardar puntajes

## 🎨 Diseño

Todos los colores y diseño son idénticos al original:
- Amarillo: `#dcee2d`
- Rojo: `#cf4526`
- Azul: `#21b1f8`
- Verde: `#47ebcd`
- Gris: `#656565`

## 🐛 Solución de problemas

### El juego no carga
- Asegúrate de abrir `/clean/index.html` (no el root del proyecto)
- Usa Live Server o un servidor HTTP local
- Verifica que tienes conexión a internet (Three.js se carga desde CDN)

### No se ve el logo
- Los archivos SVG deben estar en la misma carpeta que index.html
- Verifica que `union-logo-outline.svg` y `union-logo-filled.svg` existen

### No hay música
- La música se carga desde `./midiplayer/dance.mid`
- Asegúrate de que la carpeta `midiplayer` está completa
- Haz click en la página para activar el AudioContext (requerimiento del navegador)

### Errores de CORS
- No abras el archivo directamente (file://)
- Usa Live Server o un servidor HTTP local

## 📝 Notas

- El juego se escala automáticamente para adaptarse a cualquier tamaño de ventana
- Proporción fija: 1166x1920 (formato vertical)
- Totalmente funcional sin dependencias externas (excepto Three.js desde CDN)
- No requiere build ni compilación

¡Disfruta del juego! 🎮✨
