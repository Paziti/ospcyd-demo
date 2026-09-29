import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper p-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <Wordmark size="lg" withDescriptor />
        <h1 className="mt-4 text-2xl font-bold">No encontramos esta página</h1>
        <p className="text-muted">Puede que el enlace esté mal escrito o que la sección ya no exista.</p>
        <ButtonLink href={ROUTES.home} size="lg">
          Ir al inicio
        </ButtonLink>
      </div>
    </main>
  );
}
