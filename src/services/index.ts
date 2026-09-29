import type { Services } from "@/core/services/contracts";
import { createMockServices } from "@/mock/mock-services";
import { webStore } from "@/platform/web/storage";

/**
 * Punto único de composición de servicios.
 * Para conectar la API real: implementar `Services` (core/services/contracts.ts)
 * con un cliente HTTP y devolverlo acá. Ningún componente importa desde `mock/`.
 *
 * En la demo, agregar `?simular-error` a la URL hace fallar las solicitudes
 * para mostrar los estados de error.
 */
export const services: Services = createMockServices({
  store: webStore,
  shouldFail: () =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("simular-error"),
});
