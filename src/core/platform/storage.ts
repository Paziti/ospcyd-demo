/**
 * Almacenamiento clave/valor asíncrono. En web se implementa con localStorage;
 * en React Native con expo-secure-store (sesión) y AsyncStorage (preferencias).
 */
export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
