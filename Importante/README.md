# 📱 DistriSync - Plataforma de E-commerce

Plataforma de comercio electrónico desarrollada con HTML, CSS y JavaScript. Gestión de catálogo de productos, carrito de compras y autenticación de usuarios.

---

## 🎯 Descripción General

DistriSync es una aplicación web de e-commerce que permite a los usuarios:
- Navegar un catálogo de productos con filtros
- Agregar productos al carrito
- Gestionar compras
- Acceder a cuenta personal
- Ver dashboard de administración

---

## 📂 Estructura del Proyecto

```
distri/
├── catalogoProductos.html      # Catálogo principal con grid de productos
├── carrito.html                # Página de carrito de compras
├── LoginDistriSync.html        # Página de login
├── registro.html               # Página de registro
├── dashboard.html              # Panel de control
├── producto.html               # Gestión de inventario
├── 
├── css/
│   ├── styleCatalogo.css       # Estilos del catálogo
│   ├── styleCarrito.css        # Estilos del carrito
│   ├── styleLogin.css          # Estilos de login
│   ├── styleRegistro.css       # Estilos de registro
│   ├── styleDashboard.css      # Estilos del dashboard
│   ├── estilos.css             # Índice de estilos
│   └── styleCatalogo.css       # Estilos generales
│
├── js/
│   ├── catalogoProductos.js    # Lógica del catálogo
│   ├── carrito.js              # Lógica del carrito (localStorage)
│   ├── login.js                # Lógica de login
│   ├── registro.js             # Lógica de registro
│   ├── app.js                  # Lógica general
│   └── producto.html           # Scripts varios
│
└── v1.png                      # Logo de DistriSync
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Púrpura Oscuro | `#4B0082` | Headers, botones principales |
| Púrpura Claro | `#c19ddd` | Fondos principales |
| Púrpura Muy Claro | `#f3e8ff` | Tarjetas, sidebars |
| Púrpura Medio | `#e6d4f5` | Inputs, bordes |
| Blanco | `#ffffff` | Texto en headers |

---

## 📦 Módulos y Funcionalidades

### 1. **Catálogo de Productos** (`catalogoProductos.html`)
**Descripción:** Vista principal del catálogo con grid de productos.

**Funcionalidades:**
- ✅ Filtrar por categorías (Todas, Limpieza Capilar, Limpieza Facial, Maquillaje, Hidratación)
- ✅ Tabs para secciones (Catálogo, Sugeridos, Favoritos)
- ✅ Búsqueda en tiempo real
- ✅ Agregar productos al carrito
- ✅ Favoritos

**Archivos asociados:**
- `js/catalogoProductos.js` - Lógica de filtrado y búsqueda
- `css/styleCatalogo.css` - Estilos responsivos

**Cómo funciona:**
```javascript
// Al hacer click "Ver más"
verProducto(id) → agregarAlCarrito() → confirm() → carrito.html
```

---

### 2. **Carrito de Compras** (`carrito.html`)
**Descripción:** Gestor completo del carrito con localStorage persistente.

**Funcionalidades:**
- ✅ Agregar/eliminar productos
- ✅ Aumentar/disminuir cantidades
- ✅ Cálculo automático de subtotal, impuesto (19%) y total
- ✅ Limpiar carrito completo
- ✅ Persistencia con localStorage
- ✅ Sincronización entre catálogo y carrito

**Archivos asociados:**
- `js/carrito.js` - Lógica del carrito y localStorage
- `css/styleCarrito.css` - Estilos del carrito

**Datos almacenados (localStorage):**
```json
{
  "carrito": [
    {
      "id": 1,
      "nombre": "Maquillaje",
      "precio": 45.99,
      "categoria": "maquillaje",
      "img": "https://...",
      "cantidad": 2
    }
  ]
}
```

---

### 3. **Login** (`LoginDistriSync.html`)
**Descripción:** Página de autenticación de usuarios.

**Funcionalidades:**
- ✅ Formulario de email y contraseña
- ✅ Enlace a registro
- ✅ Validación básica

**Archivos asociados:**
- `js/login.js` - Lógica de autenticación
- `css/styleLogin.css` - Estilos

---

### 4. **Registro** (`registro.html`)
**Descripción:** Página de creación de nuevas cuentas.

**Funcionalidades:**
- ✅ Formulario: nombre, email, contraseña
- ✅ Enlace a login
- ✅ Validación

**Archivos asociados:**
- `js/registro.js` - Lógica de registro
- `css/styleRegistro.css` - Estilos

---

### 5. **Dashboard** (`dashboard.html`)
**Descripción:** Panel de control para administradores.

**Funcionalidades:**
- ✅ Sidebar con menú de secciones
- ✅ Vistas: Productos, Clientes, Ventas
- ✅ Interfaz limpia y profesional

**Archivos asociados:**
- `js/app.js` - Lógica del dashboard
- `css/styleDashboard.css` - Estilos con paleta DistriSync

---

### 6. **Gestión de Inventario** (`producto.html`)
**Descripción:** Sistema completo de inventario y productos.

**Funcionalidades:**
- ✅ Tabla de productos
- ✅ Búsqueda y filtros
- ✅ Agregar/editar productos
- ✅ Exportar datos (Excel, PDF, JSON, HTML)
- ✅ Modal para nuevo producto

**Archivos asociados:**
- `js/app.js` - Lógica completa
- `css/estilos.css` - Estilos

---

## 🔄 Flujo de la Aplicación

```
Catálogo → Click "Ver más" →
    ↓
Confirma agregar al carrito →
    ↓
Redirige a carrito.html →
    ↓
Ve productos agregados →
    ↓
Aumenta/disminuye cantidad o elimina →
    ↓
Calcula totales automáticamente →
    ↓
Botón "Continuar Compra" → Checkout (por hacer)
```

---

## 💾 Almacenamiento de Datos

**localStorage - Carrito:**
```javascript
// Se guarda automáticamente
localStorage.setItem('carrito', JSON.stringify(carrito));

// Se carga al iniciar
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
```

**Ventajas:**
- Datos persistentes entre sesiones
- No requiere base de datos
- Funciona offline
- Sincronizado entre páginas del mismo origen

---

## 🎯 Productos Disponibles

```javascript
[
  { id: 1, nombre: 'Maquillaje', precio: 45.99 },
  { id: 2, nombre: 'Skincare', precio: 55.99 },
  { id: 3, nombre: 'Hidratación', precio: 35.99 },
  { id: 4, nombre: 'Limpieza Facial', precio: 29.99 },
  { id: 5, nombre: 'Limpieza Capilar', precio: 32.99 },
  { id: 6, nombre: 'Spa', precio: 65.99 },
  { id: 7, nombre: 'Cuidado Facial', precio: 48.99 },
  { id: 8, nombre: 'Belleza Natural', precio: 42.99 }
]
```

---

## 🚀 Cómo Usar

### 1. **Navegar Catálogo**
1. Abre `catalogoProductos.html`
2. Filtra por categoría en el sidebar
3. Usa la búsqueda para encontrar productos

### 2. **Agregar al Carrito**
1. Click en "Ver más" en cualquier producto
2. Confirma que quieres agregarlo
3. Se redirige al carrito automáticamente

### 3. **Gestionar Carrito**
1. Aumenta/disminuye cantidades
2. Elimina productos individuales
3. Ve totales actualizados en tiempo real

### 4. **Persistencia**
- Al recargar la página, el carrito se mantiene
- Al cerrar el navegador, los productos quedan guardados

---

## 🔧 Tecnologías Usadas

- **HTML5** - Estructura
- **CSS3** - Diseño y animaciones
- **JavaScript (Vanilla)** - Lógica interactiva
- **localStorage API** - Persistencia de datos
- **Google Fonts** - Tipografía (Playfair Display, Montserrat)
- **Unsplash** - Imágenes de productos

---

## 📱 Responsividad

Todos los módulos son responsive:
- **Desktop:** Grid de 4 columnas
- **Tablet:** Grid de 2-3 columnas
- **Mobile:** Grid de 1 columna

---

## ✨ Características Principales

- 🎨 **Diseño uniforme** - Misma paleta en todos los módulos
- 📦 **Catálogo funcional** - Filtros, búsqueda y favoritos
- 🛒 **Carrito persistente** - localStorage para datos
- 💳 **Totales automáticos** - Subtotal, impuesto, total
- 📊 **Dashboard profesional** - Interfaz para admins
- 🔐 **Autenticación** - Login y registro
- ⚡ **Performance** - Sin librerías externas (JavaScript vanilla)

---

## 🎓 Aprendizajes Clave

### Organización de CSS
- Separamos estilos por módulo
- Paleta de colores consistente
- Reutilización de clases

### Lógica de JavaScript
- Funciones reutilizables
- localStorage sincronizado
- Eventos y delegación

### Flujo de datos
- Producto → Carrito → localStorage
- Sincronización entre páginas
- Cálculos automáticos

---

## 🚧 Próximos Pasos (Por Hacer)

- [ ] Conectar a base de datos (MongoDB/Firebase)
- [ ] Sistema de autenticación real
- [ ] Módulo de checkout/pagos
- [ ] Historial de compras del usuario
- [ ] Perfil de usuario
- [ ] Sistema de reviews
- [ ] Admin panel completo
- [ ] Email de confirmación

---

## 📝 Notas Importantes

1. **Las imágenes** están usando Unsplash - cambiar por imágenes reales después
2. **Base de datos** - Actualmente sin base de datos, todo en localStorage
3. **Logo** - `v1.png` debe estar en la raíz del proyecto
4. **Fuentes** - Se cargan desde Google Fonts (requiere internet)

---

## 👥 Equipo

Desarrollado con Copilot (GitHub)

---

## 📄 Licencia

Proyecto personal - DistriSync 2026

---

## 📞 Contacto

Cualquier duda sobre la estructura o funcionalidades, revisar los comentarios en el código.

---

**Última actualización:** 25 de Marzo de 2026
**Estado:** En desarrollo
**Versión:** 1.0
