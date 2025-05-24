import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/lib/provider";
import '@rainbow-me/rainbowkit/styles.css';

export const metadata: Metadata = {
  title: "Zenova - AI-Powered Tokenized Stock Platform",
  description:
    "Experience AI-driven company evaluation and tokenized stocks with Zenova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
