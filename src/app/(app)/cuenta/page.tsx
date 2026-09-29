import type { Metadata } from "next";
import { AccountScreen } from "@/features/account/AccountScreen";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function Page() {
  return <AccountScreen />;
}
