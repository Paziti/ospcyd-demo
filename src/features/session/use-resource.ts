"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "@/core/services/errors";

export type Resource<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

/** Carga asíncrona con estados explícitos (cargando, error, listo) y reintento. */
export function useResource<T>(load: () => Promise<T>): Resource<T> & { retry: () => void } {
  const [state, setState] = useState<Resource<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setState({ status: "ready", data }),
      (error) => active && setState({ status: "error", message: errorMessage(error) }),
    );
    return () => {
      active = false;
    };
  }, [load, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
