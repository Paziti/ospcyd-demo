# OSPyD Mobile · Sistema de diseño y arquitectura (demo)

> Documento de trabajo. Todo lo marcado como **provisional** se reemplaza cuando OSPyD entregue su material oficial.

## Lectura de diseño

App de salud para afiliados de una obra social argentina, lenguaje institucional sobrio y muy legible.
Diales: **ENERGY 1 / RHYTHM 2 / MOTION 2**.
Una sola pieza protagonista por pantalla: la credencial.

## Insumos analizados

- `WhatsApp Video 2026-09-28 at 12.29.44.mp4`: presentación de la app de otra obra social (OSTCARA). Se toma como referencia de **flujo**, no de marca:
  login DNI + clave, menú Mi cuenta / Mi credencial / Nuestra empresa / Contacto / Cerrar sesión, credencial con frente y dorso deslizable,
  campos Nº afiliado, empresa, CUIT, tipo de afiliado, vencimiento, estado "Con cobertura", y leyenda de la Superintendencia de Servicios de Salud en el dorso.
- Identidad pública de OSPyD: no se encontró sitio, logo ni paleta indexados. La identidad de esta demo es **provisional**.

## Decisiones (una línea cada una)

| Decisión | Razón |
|---|---|
| Azul tinta `#0B2540` como superficie de marca | Transmite institución y seguridad; es el color de la credencial y del login, no de toda la app. |
| Azul `#1A56A6` para acciones | Un único color interactivo (7.2:1 sobre blanco) para que "lo tocable" sea inequívoco. |
| Celeste `#5BB8E6` como único acento, solo decorativo | Guiño a la tradición visual de las obras sociales argentinas; se usa solo sobre tinta (banda de seguridad, indicador "en vivo"). |
| Verde / ámbar / rojo solo para estados | Cobertura activa, por vencer, vencida. Nunca como decoración. |
| Fondo `#F3F5F7` + superficies blancas | Separación por plano, no por sombras. |
| Atkinson Hyperlegible Next (texto) | Diseñada para baja visión; el público incluye adultos mayores leyendo en recepción. |
| Atkinson Hyperlegible Mono (números) | DNI y Nº de afiliado sin ambigüedad 0/O, 1/l al dictarlos o tipearlos. |
| Iconos Phosphor | Variante rellena = pestaña activa (convención iOS/Android); existe paquete para React Native. |
| Radios: 10 px controles, 16 px paneles, 4 % del ancho en la credencial | La credencial replica la proporción ISO ID‑1 (85,6 × 54 mm) de una tarjeta física. |
| Sombra solo en la credencial y en hojas modales | Son los únicos objetos "físicos" o superpuestos. |
| Motivo de identidad: líneas guilloche | Remite a documentos de seguridad; aparece en credencial y login. |
| Solo tema claro | La credencial se muestra y escanea en recepción: máximo contraste y brillo. El tema oscuro queda para la app nativa (seguir al sistema). |
| Navegación inferior (mobile), riel (tablet), sidebar (desktop) | 5 destinos primarios, siempre a un toque; en desktop la navegación es persistente. |
| Credencial "en vivo" (reloj, QR que se renueva) | El prestador distingue una credencial real de una captura de pantalla. |

## Tokens

- Espaciado base 4 px. Márgenes de pantalla: 16 px (mobile), 24 px (tablet), 32–40 px (desktop).
- Tipografía: título de pantalla 28/32 700 (24 en ≤ 360 px), sección 18/24 700, cuerpo 16/24, etiqueta 14/20 600, nota 13/18.
- Touch targets mínimo 44 × 44 px; filas de lista 56 px.
- Movimiento: 160–240 ms, curva `cubic-bezier(.2,.8,.2,1)`. Con `prefers-reduced-motion` se reemplaza por cambios instantáneos.

## Arquitectura

```
src/
  app/                 Rutas Next.js (delgadas: componen features)
  core/                Portable a React Native: sin DOM ni Next
    models/            Tipos de dominio (Member, Credential, Session…)
    services/          Contratos (AuthService, MemberService…) + registro
    lib/               Reglas puras (estado de credencial, payload QR, formatos)
  mock/                Implementación mock de los servicios + datos ficticios
  content/             Contenido institucional y de contacto (provisional)
  platform/web/        Adaptadores web: storage, cookie de sesión, share, wake lock
  features/            Pantallas por dominio (auth, home, account, credential, company, contact)
  components/ui/       Sistema de componentes
  components/layout/   AppShell, navegación
```

Reemplazar mock por API real = implementar las interfaces de `core/services/contracts.ts` y cambiar el registro en `core/services/index.ts`. La UI no importa nunca desde `mock/`.
