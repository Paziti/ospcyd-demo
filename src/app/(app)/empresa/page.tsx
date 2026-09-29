import type { Metadata } from "next";
import { CompanyScreen } from "@/features/company/CompanyScreen";

export const metadata: Metadata = { title: "Nuestra empresa" };

export default function Page() {
  return <CompanyScreen />;
}
