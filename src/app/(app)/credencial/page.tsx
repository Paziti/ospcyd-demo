import type { Metadata } from "next";
import { CredentialScreen } from "@/features/credential/CredentialScreen";

export const metadata: Metadata = { title: "Mi credencial" };

export default function Page() {
  return <CredentialScreen />;
}
