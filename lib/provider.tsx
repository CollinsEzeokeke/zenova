"use client";

import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { ThemeProvider } from "next-themes";
import { TanstackProviders } from "./tanstack-providers";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <TanstackProviders>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#0E76FD",
              accentColorForeground: "white",
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
