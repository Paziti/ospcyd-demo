"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Member } from "@/core/models/member";
import type { LoginCredentials, Session } from "@/core/models/session";
import { ServiceError } from "@/core/services/errors";
import { services } from "@/services";
import { sessionStore } from "@/platform/web/session-store";

type SessionState =
  | { status: "restoring" }
  | { status: "anonymous"; reason?: "logout" }
  | { status: "authenticated"; session: Session; member: Member | null; profileError: string | null };

interface SessionContextValue {
  state: SessionState;
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  reloadProfile(): Promise<void>;
  setMember(member: Member): void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "restoring" });

  const loadProfile = useCallback(async (session: Session) => {
    try {
      const member = await services.member.getProfile(session);
      setState({ status: "authenticated", session, member, profileError: null });
    } catch (error) {
      if (error instanceof ServiceError && (error.code === "SESSION_EXPIRED" || error.code === "UNKNOWN_MEMBER")) {
        await sessionStore.clear();
        setState({ status: "anonymous" });
        return;
      }
      setState({
        status: "authenticated",
        session,
        member: null,
        profileError: error instanceof ServiceError ? error.message : "No pudimos cargar tus datos.",
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    sessionStore.load().then((session) => {
      if (cancelled) return;
      if (!session) {
        setState({ status: "anonymous" });
        return;
      }
      setState({ status: "authenticated", session, member: null, profileError: null });
      void loadProfile(session);
    });
    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const session = await services.auth.login(credentials);
      await sessionStore.save(session);
      await loadProfile(session);
    },
    [loadProfile],
  );

  const logout = useCallback(async () => {
    if (state.status === "authenticated") {
      await services.auth.logout(state.session).catch(() => undefined);
    }
    await sessionStore.clear();
    setState({ status: "anonymous", reason: "logout" });
  }, [state]);

  const reloadProfile = useCallback(async () => {
    if (state.status !== "authenticated") return;
    setState({ ...state, profileError: null });
    await loadProfile(state.session);
  }, [state, loadProfile]);

  const setMember = useCallback((member: Member) => {
    setState((prev) => (prev.status === "authenticated" ? { ...prev, member, profileError: null } : prev));
  }, []);

  const value = useMemo(
    () => ({ state, login, logout, reloadProfile, setMember }),
    [state, login, logout, reloadProfile, setMember],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}

/** Para pantallas internas: el guard del layout garantiza que hay sesión y perfil. */
export function useAuthenticated(): { session: Session; member: Member } {
  const { state } = useSession();
  if (state.status !== "authenticated" || !state.member) {
    throw new Error("useAuthenticated requiere una sesión con perfil cargado");
  }
  return { session: state.session, member: state.member };
}
