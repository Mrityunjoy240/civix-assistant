import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Civix | The Sovereign AI Election Engine",
  description: "Next-gen multimodal election assistant powered by Gemini 2.5. Real-time deadlines, polling maps, and secure civic tools.",
  manifest: "/manifest.json",
  keywords: ["Google Gemini", "Next.js 15", "Election India", "Vibe Coding", "Civic Tech"],
  authors: [{ name: "Civix Team" }],
  openGraph: {
    title: "Civix | AI Election Assistant",
    description: "Built for Google PromptWars 2026. Combining Generative AI with Deterministic Logic.",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#4f46e5", // Updated to indigo
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body className={`${plusJakarta.className} bg-[#f0f4f8] text-slate-900`}>
        <Providers>{children}</Providers>
        <GoogleAnalytics gaId="G-XYZ1234567" />
      </body>
    </html>
  );
}
