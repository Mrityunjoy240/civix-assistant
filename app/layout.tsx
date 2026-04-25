import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Civix | Your Election Process Guide",
  description: "Navigate the election process with ease. Get registration deadlines, ballot info, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body className={`${inter.className} bg-white text-slate-900`}>{children}</body>
    </html>
  );
}
