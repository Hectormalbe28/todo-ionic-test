# Todo App (Ionic + Angular)

Aplicacion movil para gestion de tareas con categorias, persistencia local y control remoto de funcionalidades mediante Firebase Remote Config.

## Resumen

Todo App permite organizar tareas de forma simple, rapida y escalable. Incluye filtros por categoria, estado de completado, paginacion para listas grandes y una arquitectura basada en servicios para facilitar mantenimiento y evolucion.

## Tecnologias

- Ionic 8
- Angular 20
- Capacitor 8
- Cordova 12 (integracion hibrida)
- Firebase Remote Config
- LocalStorage (persistencia local)
- Jasmine + Karma (testing)
- ESLint (calidad de codigo)

## Funcionalidades

- Crear tareas.
- Marcar tareas como completadas.
- Eliminar tareas.
- Crear categorias.
- Eliminar categorias.
- Asignar categoria a cada tarea.
- Filtrar tareas por categoria.
- Navegacion por tabs controlada por feature flag remoto.
- Paginacion de tareas y categorias para rendimiento en listas largas.

## Arquitectura

La aplicacion sigue una estructura por capas:

- Capa de UI: componentes y paginas en `src/app/home`.
- Capa de dominio/datos: servicios en `src/app/services/data`.
- Capa de integracion remota: `src/app/services/remote`.
- Configuracion de entorno: `src/environments`.

Servicios clave:

- `TaskService`: operaciones CRUD de tareas.
- `CategoryService`: operaciones CRUD de categorias.
- `BaseDataService`: base reutilizable para colecciones con persistencia.
- `LocalStorageService`: abstraccion de almacenamiento local.
- `FeatureFlagService`: lectura de flags desde Firebase Remote Config.

## Requisitos

- Node.js 18+
- npm 9+
- Ionic CLI (`npm install -g @ionic/cli`)
- Cordova CLI (`npm install -g cordova`)

Para build nativa:

- Android: Android Studio + SDK.
- iOS: macOS + Xcode.

## Instalacion

```bash
npm install
```

## Ejecucion en desarrollo

```bash
npm start
```

## Scripts disponibles

```bash
npm run build
npm run lint
npm run test
npm run watch
```

## Build hibrida

Agregar plataformas:

```bash
ionic cordova platform add android
ionic cordova platform add ios
```

Compilar Android:

```bash
ionic cordova build android
```

Compilar iOS (solo macOS):

```bash
ionic cordova build ios --prod
```

Salida APK (Android):

`platforms/android/app/build/outputs/apk/`

## Feature Flags (Firebase Remote Config)

Flag principal:

- `enable_categories`

Comportamiento:

- `true`: habilita vista con tabs de Categorias/Tareas.
- `false`: muestra flujo simplificado de tareas.

## Rendimiento

Estrategias aplicadas:

- `ChangeDetectionStrategy.OnPush`.
- Estado reactivo con `signals` y `computed`.
- `trackBy` en listas.
- Paginacion para reducir renderizado y consumo de memoria.
- Registro explicito de iconos usados.

## Estructura de carpetas

```text
src/
  app/
    home/
    models/
    services/
      data/
      remote/
  environments/
  assets/
```

## Calidad y pruebas

- Linting con ESLint.
- Pruebas unitarias con Jasmine/Karma.
- Separacion de responsabilidades en servicios para facilitar testing y mantenibilidad.

## Licencia

MIT
