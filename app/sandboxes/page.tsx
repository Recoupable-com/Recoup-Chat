import SandboxesPage from "@/components/Sandboxes/SandboxesPage";
import { Metadata } from "next";

const BASE_URL = "https://chat.recoupable.com";

export const metadata: Metadata = {
  title: "Sandboxes | Recoupable",
  description: "Use sandboxes to build your own record label.",
  openGraph: {
    title: "Sandboxes | Recoupable",
    description: "Use sandboxes to build your own record label.",
    url: `${BASE_URL}/sandboxes`,
    images: [
      {
        url: `${BASE_URL}/backgrounds/marketing_screenshot.png`,
        width: 1200,
        height: 630,
        alt: "Recoupable Sandboxes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandboxes | Recoupable",
    description: "Use sandboxes to build your own record label.",
    images: [`${BASE_URL}/backgrounds/marketing_screenshot.png`],
  },
};

export default function Page() {
  return <SandboxesPage />;
}
