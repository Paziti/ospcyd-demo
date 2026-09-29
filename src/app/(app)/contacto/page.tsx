import type { Metadata } from "next";
import { ContactScreen } from "@/features/contact/ContactScreen";

export const metadata: Metadata = { title: "Contacto" };

export default function Page() {
  return <ContactScreen />;
}
