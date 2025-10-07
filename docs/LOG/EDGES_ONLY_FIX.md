# 🔲 CORRECCIONES VISUALES - SOLO BORDES

## ✅ CAMBIOS APLICADOS:

### 1. 📐 **Cámara Alejada**
- **Antes:** `z = 8` (demasiado cerca)
- **Después:** `z = 15` (distancia intermedia)

### 2. 🔳 **Solo Bordes Externos (Sin Diagonales)**
- **Antes:** `wireframe: true` (mostraba TODAS las líneas, incluyendo diagonales)
- **Después:** `EdgesGeometry + LineSegments` (solo bordes externos del cubo)

### 3. 🎨 **Nuevo Sistema de Renderizado**
- Cambié de `Mesh` con `wireframe` a `LineSegments` con `EdgesGeometry`
- Solo se ven las **12 aristas externas** del cubo (sin las diagonales internas)
- Mantiene los colores exactos: #CF4526, #21B1F8, #47EBCD

## 🔍 **DIFERENCIA TÉCNICA:**

### ❌ ANTES (wireframe: true):
```
┌─────┐    ← Mostraba diagonales internas
│\   /│    
│ \ / │    ← Líneas diagonales no deseadas
│ / \ │    
│/   \│    
└─────┘    
```

### ✅ DESPUÉS (EdgesGeometry):
```
┌─────┐    ← Solo bordes limpios
│     │    
│     │    ← Sin diagonales
│     │    
│     │    
└─────┘    
```

## 🎮 **Resultado:**
- ✅ Cubos con **solo bordes externos**
- ✅ **Sin líneas diagonales**
- ✅ Cámara a distancia **intermedia**
- ✅ Colores correctos mantenidos
- ✅ Efectos de flash y modo amarillo funcionando

**Prueba en:** `http://localhost:8080`