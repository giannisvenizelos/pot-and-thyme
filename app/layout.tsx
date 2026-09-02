import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pot & Thyme",
  description: "Pot & Thyme meal planning app.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/assets/pot-thyme-logo.svg",
    shortcut: "/assets/pot-thyme-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className="antialiased">{children}</body>
    </html>
  );
}
