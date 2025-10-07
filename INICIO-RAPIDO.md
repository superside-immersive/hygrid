# ⚡ INICIO RÁPIDO

## 🎮 Para Jugar AHORA

1. **Abre el archivo:**
   ```
   index.html
   ```
   Con doble click o desde tu navegador

2. **¡Listo!** Presiona cualquier tecla para jugar

---

## 🔧 Para Desarrollo

### Opción 1: Live Server (Recomendado)
1. Abre VS Code en esta carpeta
2. Instala extensión "Live Server"
3. Click derecho en `index.html` → "Open with Live Server"

### Opción 2: Python Server
```bash
python3 -m http.server 8000
```
Luego abre: http://localhost:8000

### Opción 3: Node.js
```bash
npx http-server
```

---

## 📁 Estructura Final

```
clean/
├── index.html              ← HTML principal (refactorizado)
├── README.md               ← Documentación
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
    └── LOG/               ← Historial
```

---

## 🎯 Controles

- **← →** = Mover
- **↓** = Bajar rápido
- **↑ / Espacio** = Rotar
- **Q** = Modo amarillo (debug)

---

## 📖 Más Info

- [README.md](README.md) - Documentación completa
- [docs/LOG/ESTRUCTURA.md](docs/LOG/ESTRUCTURA.md) - Estructura detallada
- [docs/LOG/REORGANIZACION.md](docs/LOG/REORGANIZACION.md) - Historia de cambios

---

## ✅ Verificación

**Código completamente organizado:**
- ✅ `src/main.js` - Entry point
- ✅ `src/core/` - Lógica principal del juego
- ✅ `src/scenes/` - Escenas 3D
- ✅ `src/managers/` - Gestores de estado
- ✅ `src/ui/` - Controladores de interfaz
- ✅ `src/audio/` - Controladores de audio
- ✅ `src/styles/` - Estilos CSS separados

**Solo excepción:** `assets/audio/midiplayer/*.js` (librerías MIDI externas)

## 🎨 Refactorización HTML/CSS

**index.html reducido de 1062 → 140 líneas**
- CSS extraído a archivos separados
- JavaScript UI/Audio en controladores
- SVGs profesionales para overlays
- Ver `docs/LOG/REFACTORIZACION-HTML-CSS.md` para detalles

---

**¡Diviértete!** 🎮✨
