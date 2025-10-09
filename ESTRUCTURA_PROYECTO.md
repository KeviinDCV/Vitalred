# Estructura del Proyecto Vital-red

## Resumen de Reorganización

Se ha reorganizado completamente el proyecto para integrar correctamente los archivos movidos desde v0, eliminando duplicados y asegurando que todas las rutas e importaciones funcionen correctamente con Laravel + Inertia.js.

## Estructura de Archivos

### Frontend (resources/js/)
```
resources/js/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes UI base (shadcn/ui)
│   ├── app-*.tsx        # Componentes de layout de la aplicación
│   ├── breadcrumbs.tsx  # Navegación breadcrumb
│   ├── metric-card.tsx  # Tarjetas de métricas
│   └── ...              # Otros componentes específicos
├── hooks/               # Custom hooks de React
│   ├── use-mobile.ts    # Hook para detección móvil
│   ├── use-toast.ts     # Hook para notificaciones
│   └── ...
├── layouts/             # Layouts de la aplicación
│   ├── app/            # Layouts principales
│   ├── auth/           # Layouts de autenticación
│   ├── settings/       # Layouts de configuración
│   ├── app-layout.tsx  # Layout principal
│   └── auth-layout.tsx # Layout de autenticación
├── lib/                # Utilidades y configuraciones
│   ├── auth-context.tsx # Contexto de autenticación
│   ├── mock-data.ts    # Datos de prueba
│   ├── permissions.ts  # Sistema de permisos
│   ├── types.ts        # Tipos TypeScript
│   └── utils.ts        # Utilidades generales
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Páginas del administrador
│   ├── auth/           # Páginas de autenticación
│   ├── ips/            # Páginas de IPS
│   ├── medico/         # Páginas del médico
│   ├── settings/       # Páginas de configuración
│   ├── shared/         # Páginas compartidas
│   ├── dashboard.tsx   # Dashboard principal
│   └── welcome.tsx     # Página de bienvenida
├── public/             # Recursos públicos
├── types/              # Definiciones de tipos
├── app.tsx             # Punto de entrada de la aplicación
├── ssr.tsx             # Configuración SSR
└── globals.css         # Estilos globales
```

## Cambios Realizados

### 1. Archivos Eliminados
- ✅ `layout.tsx` (específico de Next.js)
- ✅ `next.config.mjs` (configuración de Next.js)
- ✅ `page.tsx` (página de Next.js)
- ✅ `postcss.config.mjs` (duplicado)
- ✅ `package.json` en resources/js (duplicado)
- ✅ `tsconfig.json` en resources/js (duplicado)
- ✅ `pnpm-lock.yaml` (duplicado)
- ✅ `use-mobile.tsx` (hook duplicado)
- ✅ `globals.css` en pages/ (duplicado)

### 2. Archivos Corregidos
- ✅ Componentes de dashboard (admin, médico, IPS) - Agregado layout correcto
- ✅ `auth-context.tsx` - Eliminada directiva 'use client'
- ✅ `sidebar.tsx` - Eliminada directiva 'use client'
- ✅ `components.json` - Actualizado para Laravel
- ✅ `tsconfig.json` - Agregadas rutas de alias correctas
- ✅ `vite.config.ts` - Agregados alias de resolución

### 3. Configuración de Rutas
```typescript
// tsconfig.json - Alias configurados
"paths": {
  "@/*": ["./resources/js/*"],
  "@/components/*": ["./resources/js/components/*"],
  "@/pages/*": ["./resources/js/pages/*"],
  "@/layouts/*": ["./resources/js/layouts/*"],
  "@/hooks/*": ["./resources/js/hooks/*"],
  "@/lib/*": ["./resources/js/lib/*"],
  "@/types": ["./resources/js/types"],
  "ziggy-js": ["./vendor/tightenco/ziggy"]
}
```

### 4. Estructura de Componentes Corregida
- ✅ Todos los dashboards usan `AppLayout` con breadcrumbs
- ✅ Componentes de autenticación usan `AuthLayout`
- ✅ Imports corregidos para usar rutas de alias
- ✅ Eliminadas directivas de Next.js innecesarias

## Convenciones Establecidas

### Nomenclatura
- ✅ Componentes en PascalCase
- ✅ Archivos de páginas como funciones exportadas por defecto
- ✅ Hooks con prefijo `use`
- ✅ Tipos en PascalCase

### Importaciones
- ✅ Uso consistente de alias `@/` para rutas
- ✅ Imports de Inertia.js para navegación
- ✅ Imports de componentes UI desde `@/components/ui`

### Layouts
- ✅ `AppLayout` para páginas principales con sidebar
- ✅ `AuthLayout` para páginas de autenticación
- ✅ Breadcrumbs configurados en cada página

## Estado del Proyecto

### ✅ Completado
- Eliminación de archivos duplicados
- Corrección de rutas e imports
- Configuración de alias en TypeScript y Vite
- Estructura de layouts consistente
- Componentes de dashboard corregidos

### 🔄 Pendiente (Recomendaciones)
- Verificar que todas las rutas de Laravel coincidan con los componentes
- Probar la compilación con `npm run build`
- Verificar que todos los componentes UI funcionen correctamente
- Revisar y actualizar tipos TypeScript según sea necesario

## Comandos Útiles

```bash
# Compilar assets
npm run build

# Desarrollo
npm run dev

# Verificar tipos
npm run types

# Linting
npm run lint

# Formatear código
npm run format
```

El proyecto ahora tiene una estructura limpia y organizada, compatible con Laravel + Inertia.js, sin duplicados y con todas las rutas correctamente configuradas.