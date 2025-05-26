"use client";

import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { ThemeProvider } from "next-themes";
import { TanstackProviders } from "./tanstack-providers";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        <Toaster />
        <Sonner />
        <TanstackProviders>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#FFC800",
              accentColorForeground: "black",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            {children}
          </RainbowKitProvider>
        </TanstackProviders>
      </ThemeProvider>
    </WagmiProvider>
  );
}
