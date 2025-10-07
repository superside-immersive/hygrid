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
├── index.html              ← HTML principal
├── README.md               ← Documentación
│
├── src/                    ← TODO EL CÓDIGO JS
│   ├── main.js            ← Punto de entrada
│   ├── core/
│   │   ├── App.js
│   │   └── TetrisGame.js
│   ├── scenes/
│   │   └── IdleScene.js
│   └── managers/
│       └── GameStateManager.js
│
├── assets/                 ← RECURSOS
│   ├── images/            ← Texturas y logos
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

**Todos los archivos JS ahora están en `src/`:**
- ✅ `src/main.js` - Entry point
- ✅ `src/core/` - Lógica principal
- ✅ `src/scenes/` - Escenas 3D
- ✅ `src/managers/` - Gestores de estado

**Solo excepción:** `assets/audio/midiplayer/*.js` (librerías MIDI externas)

---

**¡Diviértete!** 🎮✨
