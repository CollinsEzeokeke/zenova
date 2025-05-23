import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { ThemeProvider } from "next-themes";
import { TenstackProviders } from "./tanstack-providers";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <TenstackProviders>{children}</TenstackProviders>
      </ThemeProvider>
    </WagmiProvider>
  );
}
