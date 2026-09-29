import { cn } from "./cn";

interface AvatarProps {
  name: { firstName: string; lastName: string };
  photoUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "size-9 text-sm",
  md: "size-11 text-base",
  lg: "size-16 text-xl",
  xl: "size-24 text-3xl",
};

/** Sin foto se muestran iniciales: nunca se generan imágenes de personas. */
export function Avatar({ name, photoUrl, size = "md", className }: AvatarProps) {
  const initials = `${name.firstName[0] ?? ""}${name.lastName[0] ?? ""}`.toUpperCase();
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft font-bold text-brand-strong",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URL local del afiliado; next/image no aporta optimización acá.
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
