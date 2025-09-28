# Hablas Design System

Sistema de diseño completo para la plataforma Hablas - recursos de inglés para trabajadores colombianos.

## 📖 Documentación

- **[Style Guide Interactivo](./style-guide.html)** - Guía visual completa con ejemplos en vivo

## 🎨 Visión General

El Design System de Hablas está diseñado específicamente para:
- **Trabajadores móviles**: Conductores y domiciliarios que usan celulares mientras trabajan
- **Conexión limitada**: Optimizado para funcionar offline y con datos móviles
- **Accesibilidad**: Touch targets grandes, alto contraste, legibilidad óptima
- **Velocidad**: Componentes ligeros y optimizados para rendimiento

## 🎯 Principios de Diseño

### 1. **Accesibilidad Primero**
- Touch targets mínimo 44x44px
- Contraste WCAG 2.1 AA
- Navegación sin JavaScript
- Funcionalidad offline

### 2. **Mobile First**
- Diseñado para pantallas pequeñas
- Optimizado para una sola mano
- Consideraciones de conectividad
- Progressive enhancement

### 3. **Claridad y Simplicidad**
- Jerarquía visual clara
- Mensajes directos y prácticos
- Íconos universales
- Sin jerga técnica

### 4. **Rendimiento**
- CSS inline crítico
- Lazy loading de recursos
- Caché agresivo
- Bundle optimizado

## 🎨 Sistema de Colores

### Colores Primarios
- **WhatsApp Green**: `#25D366` - CTAs principales, grupos comunitarios
- **Rappi Orange**: `#FF4E00` - Tags de domiciliarios
- **Uber Black**: `#000000` - Tags de conductores
- **DiDi Orange**: `#FFA033` - Tags de conductores alternativos

### Colores de UI
- Grises: 50, 100, 200, 500, 600, 700, 900
- Semánticos: success (green), warning (yellow), info (purple)

## 📝 Tipografía

### Familia de Fuentes
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             Helvetica, Arial, sans-serif;
```

### Escala
- H1: `text-3xl sm:text-4xl` (36-48px)
- H2: `text-2xl` (24px)
- H3: `text-xl` (20px)
- H4: `text-lg` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- XSmall: `text-xs` (12px)

## 🧩 Componentes Principales

### Botones
- **WhatsApp CTA**: Botón principal para unirse a grupos
- **Download Button**: Para descargar recursos
- **Filter Pills**: Para categorización de contenido

### Cards
- **Resource Card**: Muestra recursos descargables
- **WhatsApp Group Card**: Invitación a grupos de WhatsApp
- **Stat Card**: Estadísticas y métricas

### Tags
- **Platform Tags**: Rappi, Uber, DiDi
- **Level Tags**: Básico, Intermedio
- **Status Tags**: Offline, Descargado

## 📱 Responsive Breakpoints

```javascript
{
  xs: '375px',   // Teléfonos pequeños
  sm: '640px',   // Teléfonos grandes
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop pequeño
  xl: '1280px'   // Desktop grande
}
```

## ✍️ Guías de Contenido

### Tono de Voz
- ✓ Cercano (tutear)
- ✓ Motivador
- ✓ Práctico
- ✓ Directo

### Evitar
- ✗ Lenguaje académico
- ✗ Jerga técnica
- ✗ Instrucciones largas
- ✗ Formalidad excesiva

### Ejemplos

**Bien**: "Descarga estas frases y úsalas sin datos mientras trabajas"

**Evitar**: "Puede descargar el archivo PDF para su posterior consulta offline"

## 🔧 Uso del Sistema

### Instalación

El sistema usa Tailwind CSS con configuración personalizada:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'whatsapp': '#25D366',
        'rappi': '#FF4E00',
        'didi': '#FFA033',
        'uber': '#000000',
      }
    }
  }
}
```

### Clases Utilitarias

```css
/* Botón WhatsApp */
.btn-whatsapp {
  @apply bg-whatsapp text-white font-bold py-4 px-6
         rounded-lg shadow-lg active:scale-95 transition-transform
         flex items-center justify-center gap-3 text-lg;
}

/* Card de Recurso */
.card-resource {
  @apply bg-white rounded-lg shadow-md p-4
         border border-gray-100 active:shadow-lg transition-shadow;
}

/* Tag de Trabajo */
.tag-job {
  @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
}
```

## ♿ Accesibilidad

### Requisitos Mínimos
- Contraste de texto: 4.5:1 (WCAG AA)
- Touch targets: 44x44px mínimo
- Alt text en todas las imágenes
- Labels en todos los controles
- Navegación por teclado
- Sin dependencia de JavaScript

### Testing
- [ ] Validar con lector de pantalla
- [ ] Probar en modo alto contraste
- [ ] Verificar zoom al 200%
- [ ] Comprobar funcionalidad offline
- [ ] Testear en conexión 3G

## 📚 Recursos Adicionales

- [Sitio Web](https://bjpl.github.io/hablas/)
- [Repositorio GitHub](https://github.com/bjpl/hablas)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 📝 Contribuir

Para contribuir al design system:

1. Sigue los principios establecidos
2. Mantén la accesibilidad
3. Documenta nuevos componentes
4. Actualiza el style guide
5. Prueba en dispositivos reales

## 📄 Licencia

Este design system es parte del proyecto Hablas.

---

**Versión**: 1.0
**Última actualización**: Septiembre 2025
**Mantenido por**: Equipo Hablas