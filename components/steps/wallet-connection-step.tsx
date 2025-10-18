"use client"

import { useEffect, useState } from "react"
import { useAccount, useBalance } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { generateSmartAccountAddress } from "@/lib/smart-account"

interface WalletConnectionStepProps {
  onConnected: (smartAccountAddress: string) => void
}

export function WalletConnectionStep({ onConnected }: WalletConnectionStepProps) {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined })
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isConnected && address && !smartAccountAddress) {
      setIsGenerating(true)
      // Simulate smart account generation
      const timer = setTimeout(() => {
        const generated = generateSmartAccountAddress(address)
        setSmartAccountAddress(generated)
        setIsGenerating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isConnected, address, smartAccountAddress])

  useEffect(() => {
    if (smartAccountAddress && isConnected) {
      onConnected(smartAccountAddress)
    }
  }, [smartAccountAddress, isConnected, onConnected])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
          <CardDescription className="text-slate-400">Start your smart account journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">Connect your wallet to begin the onboarding process</p>
              <ConnectKitButton />
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Your Address</label>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <code className="text-sm text-emerald-400 font-mono">{formatAddress(address!)}</code>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Connected
                  </Badge>
                </div>
              </div>

              {/* Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Network</label>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <span className="text-sm text-slate-300">{chain?.name}</span>
                  {chain?.id === 84532 && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">✓ Base Sepolia</Badge>
                  )}
                </div>
              </div>

              {/* EOA Balance */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">EOA Balance</label>
                <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p className="text-lg font-semibold text-white">
                    {balance ? Number.parseFloat(balance.formatted).toFixed(4) : "0.0000"} {balance?.symbol}
                  </p>
                </div>
              </div>

              {/* Smart Account Balance */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Smart Account Balance</label>
                <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p className="text-lg font-semibold text-slate-400">0.0000 ETH</p>
                </div>
              </div>

              {/* Smart Account Address */}
              {isGenerating ? (
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <Spinner className="mr-2" />
                  <span className="text-sm text-slate-400">Generating smart account...</span>
                </div>
              ) : smartAccountAddress ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Smart Account Address</label>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                    <code className="text-sm text-purple-400 font-mono">{formatAddress(smartAccountAddress)}</code>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                      Generated
                    </Badge>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
