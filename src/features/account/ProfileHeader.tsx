"use client";

import { useRef, useState } from "react";
import { Camera, Trash } from "@phosphor-icons/react/dist/ssr";
import type { Member } from "@/core/models/member";
import { errorMessage } from "@/core/services/errors";
import { fullName } from "@/core/lib/format";
import { services } from "@/services";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { useAuthenticated, useSession } from "@/features/session/session-context";
import { resizeImageToSquare } from "@/platform/web/device";

const MAX_FILE_MB = 10;

export function ProfileHeader({ member }: { member: Member }) {
  const { session } = useAuthenticated();
  const { setMember } = useSession();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function savePhoto(photoUrl: string | null, message: string) {
    setBusy(true);
    try {
      setMember(await services.member.updatePhoto(session, photoUrl));
      toast(message);
    } catch (error) {
      toast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Elegí un archivo de imagen (JPG o PNG).", "error");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast(`La imagen supera los ${MAX_FILE_MB} MB.`, "error");
      return;
    }
    try {
      const dataUrl = await resizeImageToSquare(file);
      await savePhoto(dataUrl, "Foto de perfil actualizada.");
    } catch {
      toast("No pudimos leer la imagen. Probá con otra.", "error");
    }
  }

  return (
    <section aria-label="Perfil" className="flex flex-col items-center gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-5 text-center sm:flex-row sm:text-left">
      <div className="relative">
        <Avatar name={member} photoUrl={member.photoUrl} size="xl" />
        {busy ? (
          <span className="absolute inset-0 grid place-items-center rounded-full bg-white/70" role="status">
            <Spinner className="size-6 text-brand" />
            <span className="sr-only">Guardando foto</span>
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-xl font-bold leading-7">{fullName(member)}</p>
        <p className="text-[15px] text-muted">
          {member.plan.name} · <span className="font-mono tabular">{member.affiliateNumber}</span>
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button variant="secondary" disabled={busy} onClick={() => input.current?.click()} icon={<Camera className="size-5" aria-hidden />}>
            {member.photoUrl ? "Cambiar foto" : "Agregar foto"}
          </Button>
          {member.photoUrl ? (
            <Button variant="ghost" disabled={busy} onClick={() => savePhoto(null, "Quitamos tu foto de perfil.")} icon={<Trash className="size-5" aria-hidden />}>
              Quitar
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
