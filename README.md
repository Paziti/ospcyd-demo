# OSPCyD · App de afiliados (demo)

Prototipo web de la futura app móvil de O.S.P.C.y.D. (Obra Social del Personal de Carga y Descarga, R.N.O.S. 1-0340-2) para iOS y Android: ingreso de afiliados, credencial digital con QR, datos de cuenta, información institucional y contacto.

> **Demo con datos ficticios.** No hay backend ni autenticación real. Ningún dato se envía a un servidor.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

Requiere Node 20 o superior.

## Afiliados de demostración

Contraseña de todos: `123456`. También se pueden elegir desde "Afiliados de demostración" en la pantalla de ingreso.

| DNI | Afiliado | Estado de la credencial |
|---|---|---|
| 12345678 | Lucía Belén Ferreyra | Vigente (titular) |
| 23456789 | Martín Ezequiel Sosa | Por vencer (titular) |
| 34567890 | Carolina Inés Paz | Vencida (familiar a cargo) |

Los vencimientos se calculan a partir de la fecha actual, así cada afiliado muestra siempre el mismo estado.

Los cambios hechos en la demo (email, teléfono, foto, contraseña) se guardan en el navegador. Para volver al estado original: "Afiliados de demostración" → "Restablecer datos de la demo".

**Estados de error:** agregar `?simular-error` a cualquier URL hace fallar las solicitudes (por ejemplo `/credencial?simular-error`).

## Qué incluye

- **Ingreso** con DNI y contraseña, validación, carga, error y recuperación de contraseña.
- **Inicio** con la credencial como elemento principal y "Mostrar en recepción" a un toque.
- **Mi credencial**: frente y dorso (botones o deslizando), QR dinámico que se renueva cada 30 s con reloj en vivo, modo pantalla completa que mantiene la pantalla encendida, código de barras Code 128, compartir y copiar número de afiliado.
- **Mi cuenta**: datos personales enmascarados (DNI y CUIL) con opción de mostrarlos, edición de contacto, cambio de foto y de contraseña.
- **Nuestra empresa** y **Contacto**: llamar, WhatsApp, email, mapa y formulario con sus estados.
- **Cerrar sesión** con confirmación. Las rutas internas quedan protegidas (proxy de Next + guard en cliente).
- Navegación inferior en mobile, riel en tablet y barra lateral en desktop. PWA instalable (manifest).

## Arquitectura

```
src/
  app/            Rutas (delgadas). (auth) = ingreso, (app) = pantallas con sesión
  core/           Portable a React Native: modelos, contratos de servicios y reglas puras
  mock/           Implementación mock de los servicios y afiliados ficticios
  content/        Textos institucionales y datos de contacto (provisionales)
  platform/web/   Adaptadores del navegador: storage, sesión, compartir, wake lock
  features/       Pantallas por dominio: auth, home, credential, account, company, contact
  components/     Sistema de componentes (ui/) y estructura (layout/, brand/)
  services/       Punto único donde se elige la implementación de los servicios
  proxy.ts        Redirección previa según sesión (ex middleware)
```

### Conectar la API real

1. Implementar la interfaz `Services` de `src/core/services/contracts.ts` con un cliente HTTP.
2. Devolverla en `src/services/index.ts` en lugar de `createMockServices`.
3. Reemplazar `src/platform/web/session-store.ts` por cookies httpOnly emitidas por el backend (y refresh tokens).
4. Borrar `src/mock/` y el componente `features/auth/DemoAccounts.tsx` (único punto de la UI que conoce el mock).
5. El QR hoy usa una firma de demostración (`core/lib/credential-code.ts`): el payload real debe firmarlo el backend.

### Camino a React Native / Expo

`core/` no depende del DOM ni de Next: modelos, contratos, validaciones, estado de credencial, generación de QR y código de barras se reutilizan tal cual. Los hooks de `features/*/use-*.ts` y el contexto de sesión usan solo React. Se reemplazan los adaptadores de `platform/web` por `expo-secure-store`, `expo-sharing`, `expo-clipboard`, `expo-keep-awake` y `expo-image-picker`, y los componentes visuales por sus equivalentes nativos siguiendo los mismos tokens (`DESIGN.md`).

## Identidad y contenido

- Marca centralizada en `src/config/brand.ts` (sigla, nombre, R.N.O.S., CUIT y la marca asociada **OMDS**).
- Isotipo oficial: `src/assets/ospcyd-isotipo.png` (del sitio ospcyd.org). Íconos de la app: `src/app/icon.png` y `src/app/apple-icon.png`.
- Contenido institucional y de contacto tomados del sitio oficial: `src/content/institution.ts` y `src/content/contact.ts`. Lo que falta está entre corchetes.
- Pendiente de OSPCyD: logo de OMDS, planes reales (hoy "Plan PMO" de referencia), procedimiento de renovación de credencial y confirmación de los datos de contacto.
- Afiliados ficticios: `src/mock/data/members.ts` (se elimina al conectar la API).

Decisiones de diseño y tokens: ver [`DESIGN.md`](./DESIGN.md).
