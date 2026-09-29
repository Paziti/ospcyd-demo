import type { KeyValueStore } from "@/core/platform/storage";

/** localStorage puede fallar (modo privado, cuota, SSR): toda lectura/escritura es tolerante. */
export const webStore: KeyValueStore = {
  async get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Sin almacenamiento la demo sigue funcionando en memoria durante la visita.
    }
  },
  async remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // idem
    }
  },
};
