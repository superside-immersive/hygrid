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

## 📁 ¿Dónde está cada cosa?

```
src/core/         → Lógica del juego
src/scenes/       → Escenas 3D
src/managers/     → Gestores de estado
assets/images/    → Imágenes y texturas
assets/audio/     → Música MIDI
docs/             → Documentación
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
- [docs/ESTRUCTURA.md](docs/ESTRUCTURA.md) - Estructura del proyecto
- [REORGANIZACION.md](REORGANIZACION.md) - Cambios recientes

---

## ⚠️ Archivos Legacy

Los archivos viejos en la raíz (game.js, etc.) se pueden eliminar después de verificar que todo funciona.

---

**¡Diviértete!** 🎮✨
