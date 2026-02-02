import SandboxesPage from "@/components/Sandboxes/SandboxesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandboxes | Recoupable",
  description: "Use sandboxes to build your own record label.",
  openGraph: {
    title: "Sandboxes | Recoupable",
    description: "Use sandboxes to build your own record label.",
    images: "/backgrounds/marketing_screenshot.png",
  },
};

export default function Page() {
  return <SandboxesPage />;
}
