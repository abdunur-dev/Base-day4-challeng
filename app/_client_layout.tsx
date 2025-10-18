"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { WagmiProvider, createConfig, http } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http("https://sepolia.base.org"),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default",
    appName: "ERC-4337 Smart Wallet",
    appDescription: "Smart Account Onboarding Flow",
    appUrl: typeof window !== "undefined" ? window.location.origin : "https://example.com",
    appIcon: "https://example.com/icon.png",
  }),
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <Analytics />
    </>
  )
}
