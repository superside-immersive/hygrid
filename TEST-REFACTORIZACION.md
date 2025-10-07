# ⚡ TESTING RÁPIDO - Verificación Post-Refactorización

## 🎯 Checklist Esencial (5 min)

### 1. Carga Inicial
```bash
cd /Users/mpalenque/tetrisclean/clean
python3 -m http.server 8000
```
Abre: http://localhost:8000

**Verificar:**
- [ ] Página carga sin errores
- [ ] Logo flotante visible (pantalla IDLE)
- [ ] Cubos flotantes en fondo
- [ ] No hay errores 404 en consola (F12)

### 2. Inicio del Juego
**Acción:** Presiona cualquier tecla

**Verificar:**
- [ ] Aparece "Get Ready!" con countdown
- [ ] Música MIDI inicia automáticamente
- [ ] Header aparece (RED/BLUE/GREEN)
- [ ] Footer aparece (Score/Logo/Level)
- [ ] Juego inicia después del countdown

### 3. Gameplay Básico
**Acción:** Juega normalmente

**Verificar:**
- [ ] Piezas caen correctamente
- [ ] Controles funcionan (←→↑↓ Espacio)
- [ ] Score incrementa
- [ ] Logo se llena gradualmente

### 4. 🎨 POWER-UP (Nuevo) ✨
**Acción:** Alcanza 10,000 puntos

**Verificar:**
- [ ] Aparece SVG "Power Up!" grande
- [ ] **NO HAY fondo oscuro** ✨
- [ ] SVG está hacia ABAJO (no centrado) ✨
- [ ] Desaparece después de 2 segundos
- [ ] Logo queda 100% lleno
- [ ] Todas las piezas se vuelven amarillas

### 5. 📈 LEVEL UP (Nuevo) ✨
**Acción:** Alcanza 3,000 puntos

**Verificar:**
- [ ] Aparece SVG "Level Up!"
- [ ] **Fondo oscuro presente** (correcto) ✨
- [ ] SVG está hacia ABAJO (no centrado) ✨
- [ ] Desaparece después de 2 segundos
- [ ] Número de nivel incrementa
- [ ] Música acelera ligeramente

### 6. Efectos de Sonido
**Verificar:**
- [ ] Sonido al completar líneas
- [ ] Sonido al entrar modo amarillo
- [ ] Sonido al subir nivel
- [ ] Sonido al colocar pieza correcta (toc)
- [ ] Sonido al colocar pieza incorrecta (toc hueco)

### 7. Game Over
**Acción:** Pierde el juego

**Verificar:**
- [ ] Pantalla "GAME OVER" aparece
- [ ] Score final visible
- [ ] Líneas totales visibles
- [ ] "Press any key to restart"

---

## 🐛 Problemas Comunes

### CSS no carga
**Síntoma:** Página sin estilos
**Solución:** Verifica rutas en index.html
```html
<link rel="stylesheet" href="./src/styles/main.css">
```

### SVGs no aparecen
**Síntoma:** Overlays vacíos
**Solución:** Verifica que existan en `assets/images/`:
```bash
ls assets/images/powerupboard.svg
ls assets/images/levelup.svg
```

### Música no suena
**Síntoma:** Silencio total
**Solución:**
1. Abre consola (F12)
2. Ejecuta: `window.debugMIDI()`
3. Verifica que diga "✅ MIDI cargado"

### Power-up tiene fondo oscuro
**Síntoma:** Fondo oscuro en power-up (incorrecto)
**Solución:** Verifica `src/styles/overlays.css`:
```css
#powerup-overlay {
  background: transparent !important;  /* Debe ser transparent */
}
```

---

## ✅ Test de Regresión (10 min)

### Funcionalidad Completa
- [ ] Pantalla IDLE funciona
- [ ] Countdown de intro funciona
- [ ] Todas las piezas rotan
- [ ] Detección de colisiones correcta
- [ ] Sistema de zonas de color funciona
- [ ] Modo amarillo funciona
- [ ] Sistema de niveles funciona
- [ ] Scoreboard guarda puntajes
- [ ] Reinicio funciona correctamente

### UI/UX
- [ ] Header visible durante juego
- [ ] Footer visible durante juego
- [ ] Logo se llena progresivamente
- [ ] Score actualiza en tiempo real
- [ ] Level actualiza al subir
- [ ] Overlays aparecen y desaparecen

### Audio
- [ ] MIDI inicia al comenzar
- [ ] MIDI pausa al perder foco
- [ ] MIDI resume al volver
- [ ] SFX suenan correctamente
- [ ] Tempo aumenta con nivel

---

## 🎯 Test Específico: Overlays Nuevos

### Power-Up Overlay
```
1. Juega hasta 10K puntos
2. Observa el overlay de power-up

✅ CORRECTO:
   - SVG "Power Up!" visible
   - Sin fondo oscuro (transparente)
   - Posición: Hacia abajo (35% desde top)
   - Duración: 2 segundos
   - Sombra amarilla brillante

❌ INCORRECTO:
   - Fondo oscuro visible
   - Centrado perfectamente
   - Texto genérico sin diseño
```

### Level-Up Overlay
```
1. Juega hasta 3K puntos (nivel 2)
2. Observa el overlay de level-up

✅ CORRECTO:
   - SVG "Level Up!" visible
   - Fondo oscuro semi-transparente
   - Posición: Hacia abajo (35% desde top)
   - Duración: 2 segundos
   - Sombra amarilla brillante

❌ INCORRECTO:
   - Sin fondo (completamente transparente)
   - Centrado perfectamente
   - Texto genérico
```

---

## 📊 Consola (F12) - Logs Esperados

### Al Cargar
```
✅ AudioContext para SFX inicializado
✅ MIDI cargado correctamente
🎵 Auto-debug MIDI después de 2 segundos:
=== MIDI DEBUG ===
MIDIPlayer exists: true
midiPlayer instance: [object Object]
Music started: false
```

### Al Iniciar Juego
```
▶️ Música iniciada
```

### Durante Juego
```
🎵 Tempo cambiado a 1.15x  (al subir nivel)
```

### NO debe aparecer
```
❌ Error cargando archivo MIDI
❌ Error inicializando AudioContext
404 Not Found (para cualquier asset)
```

---

## 🚀 Prueba de Performance

### Tiempo de Carga
- [ ] Página carga en < 2 segundos
- [ ] CSS visible inmediatamente
- [ ] Three.js renderiza en < 1 segundo
- [ ] MIDI carga en < 3 segundos

### Durante Juego
- [ ] 60 FPS constantes
- [ ] Sin lag al rotar piezas
- [ ] Sin lag al completar líneas
- [ ] Overlays aparecen suavemente

---

## 📝 Reporte de Bugs

Si encuentras problemas:

1. **Abrir consola (F12)**
2. **Copiar todos los errores**
3. **Reportar con:**
   - Navegador y versión
   - Sistema operativo
   - Pasos para reproducir
   - Captura de pantalla

---

## ✨ Test Exitoso

Si todos los checks están ✅:

**¡Refactorización exitosa!** 🎉

El proyecto ahora tiene:
- ✅ HTML limpio (145 líneas vs 1062)
- ✅ CSS modular (3 archivos)
- ✅ JavaScript organizado (controladores)
- ✅ SVGs profesionales
- ✅ Overlays correctos
- ✅ 100% funcional

---

**Siguiente paso:** Jugar y disfrutar 🎮✨
