"use client";

import { useCallback } from "react";
import { services } from "@/services";
import { useAuthenticated } from "@/features/session/session-context";
import { useResource } from "@/features/session/use-resource";

export function useCredential() {
  const { session, member } = useAuthenticated();
  // La foto vive en el perfil: si cambia, se vuelve a pedir la credencial.
  const photoUrl = member.photoUrl;
  const load = useCallback(
    () => services.credential.getCredential(session).then((c) => ({ ...c, photoUrl })),
    [session, photoUrl],
  );
  return useResource(load);
}
