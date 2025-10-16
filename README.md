# 🎮 Tetris HyGrid

Tetris game with color-zone mechanics, built with Three.js and modular JavaScript.

---

## 🚀 Quick Start

### To Play NOW
1. Open the `index.html` file by double-clicking or from your browser
2. That's it! Press any key to play

### For Development

#### Option 1: Live Server (Recommended)
1. Open VS Code in this folder
2. Install "Live Server" extension
3. Right-click on `index.html` → "Open with Live Server"

#### Option 2: Python Server
```bash
python3 -m http.server 8000
```
Then open: http://localhost:8000

#### Option 3: Node.js
```bash
npx http-server
```

---

## 🎯 Controls

- **← →** = Move piece left/right
- **↓** = Drop fast
- **↑ / Space** = Rotate piece
- **Q** = Yellow mode (debug)
- **Any key** = Start game from IDLE screen

---

## 🎮 Game Mechanics

### Objective
Place colored pieces in their corresponding zones:
- 🔴 **Red Zone** (columns 0-3): Red pieces/blocks
- 🔵 **Blue Zone** (columns 4-7): Blue pieces/blocks
- 🟢 **Green Zone** (columns 8-11): Green pieces/blocks

### Pieces
- Pieces with 2, 3, and 4 blocks
- Some pieces have multiple colors
- Multi-colored pieces can fit in different zones
- If you place a piece in the wrong zone, it turns **GRAY** and doesn't score points

### Scoring System
- **100 points** for each section completed correctly
- **Level**: Increases every 10,000 points
- **Speed**: Increases 15% per level

### Bonus Mode 🟡
Activated every 10,000 points for 5 seconds:
- All pieces turn yellow
- You can place any piece in any zone
- Take advantage to complete more lines!

---

## 🎵 Audio System

### Music
- Background music in MIDI format
- Starts automatically when the game begins
- Tempo adjusts with the level

### Sound Effects (8-bit)
- ✅ **Line completed**: "Truin!" (3 ascending notes)
- ⭐ **Entering bonus**: Bright chime
- 💎 **Reaching bonus**: Power-up
- 📈 **Level up**: Fanfare
- ⬅️➡️ **Movement**: Subtle ascending/descending tones
- ✅ **Correct piece**: Deep knock
- ❌ **Incorrect piece**: Hollow knock

---

## 📁 Project Structure

```
hygrid/
├── index.html              ← Main HTML (refactored)
├── README.md               ← This documentation
│
├── src/                    ← ALL THE CODE
│   ├── main.js            ← Entry point
│   │
│   ├── core/              ← Game logic
│   │   ├── App.js
│   │   └── TetrisGame.js
│   │
│   ├── scenes/            ← 3D Scenes
│   │   └── IdleScene.js
│   │
│   ├── managers/          ← State managers
│   │   └── GameStateManager.js
│   │
│   ├── ui/                ← UI Controllers
│   │   └── UIController.js
│   │
│   ├── audio/             ← Audio Controllers
│   │   └── AudioController.js
│   │
│   └── styles/            ← CSS Styles
│       ├── main.css
│       ├── ui.css
│       └── overlays.css
│
├── assets/                 ← RESOURCES
│   ├── images/            ← Textures, logos, SVGs
│   └── audio/             ← MIDI System
│       └── midiplayer/
│
└── docs/                   ← DOCUMENTATION
    └── CHANGELOG.md       ← Complete changelog
```

---

## 🎨 Technical Features

### Modular Architecture
- ✅ Code organized in ES6 modules
- ✅ Clear separation of concerns
- ✅ CSS extracted to separate files
- ✅ Specialized controllers (UI, Audio)

### Visual Improvements
- ✅ Success flash (green) when piece is placed correctly
- ✅ Error flash (red) when piece is placed incorrectly
- ✅ Professional overlays with SVGs
- ✅ Smooth and polished animations

### State System
1. **IDLE**: Start screen with floating cubes
2. **INTRO**: Countdown 5-4-3-2-1-GO!
3. **PLAYING**: Active gameplay
4. **GAME OVER**: Final screen with scoreboard

---

## 📊 Refactoring Metrics

| Metric | Before | Now | Improvement |
|---------|-------|-------|--------|
| **Lines in index.html** | 1062 | 145 | **-86%** |
| **Embedded CSS** | 600+ lines | 0 | **-100%** |
| **Embedded JS** | 400+ lines | 50 | **-87%** |
| **CSS Files** | 0 | 3 | +3 modules |
| **JS Controllers** | 0 | 2 | +2 classes |

---

## 🔧 Technologies Used

- **Three.js** - 3D Engine
- **Web Audio API** - Audio system
- **MIDI Player** - Background music
- **ES6 Modules** - Modular architecture
- **CSS3** - Animations and styles

---

## 📝 Changelog

See complete file at `docs/CHANGELOG.md`

### Current Version
- ✅ Color zone system
- ✅ Complete yellow bonus mode
- ✅ MIDI audio system + SFX
- ✅ HTML/CSS refactoring completed
- ✅ Modular controllers (UI/Audio)
- ✅ Visual effects (flashes, overlays)

---

## 🎯 Project Verification

**Code completely organized:**
- ✅ `src/main.js` - Entry point
- ✅ `src/core/` - Main game logic
- ✅ `src/scenes/` - 3D Scenes
- ✅ `src/managers/` - State managers
- ✅ `src/ui/` - Interface controllers
- ✅ `src/audio/` - Audio controllers
- ✅ `src/styles/` - Separated CSS styles

**Only exception:** `assets/audio/midiplayer/*.js` (external MIDI libraries)

---

**Have fun!** 🎮✨


