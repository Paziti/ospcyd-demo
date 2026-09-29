import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

/** El proxy decide entre inicio e ingreso según la sesión; esto es el respaldo. */
export default function Root() {
  redirect(ROUTES.home);
}
