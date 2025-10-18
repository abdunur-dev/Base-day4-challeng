"use client"

import { useState } from "react"
import { useBalance } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Send } from "lucide-react"

interface FundSmartAccountStepProps {
  userAddress: string | null
  smartAccountAddress: string | null
  onFundingInitiated: (amount: string) => void
}

export function FundSmartAccountStep({
  userAddress,
  smartAccountAddress,
  onFundingInitiated,
}: FundSmartAccountStepProps) {
  const { data: balance } = useBalance({ address: userAddress as `0x${string}` })
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [gasEstimate] = useState("0.0001")

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleCopyAddress = () => {
    if (smartAccountAddress) {
      navigator.clipboard.writeText(smartAccountAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleMaxClick = () => {
    if (balance) {
      const maxAmount = (Number.parseFloat(balance.formatted) * 0.9).toString()
      setAmount(maxAmount)
    }
  }

  const handleTransfer = () => {
    if (!amount || !smartAccountAddress || !userAddress) return
    onFundingInitiated(amount)
  }

  const isValidAmount =
    amount &&
    Number.parseFloat(amount) > 0 &&
    balance &&
    Number.parseFloat(amount) <= Number.parseFloat(balance.formatted)

  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Fund Your Smart Account</CardTitle>
          <CardDescription className="text-slate-400">
            Transfer ETH from your wallet to your smart account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">From</label>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <code className="text-sm text-emerald-400 font-mono">
                {userAddress ? formatAddress(userAddress) : "Not connected"}
              </code>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Your EOA
              </Badge>
            </div>
          </div>

          {/* To Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">To</label>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <code className="text-sm text-purple-400 font-mono">
                {smartAccountAddress ? formatAddress(smartAccountAddress) : "Generating..."}
              </code>
              <button
                onClick={handleCopyAddress}
                className="p-1 hover:bg-slate-600 rounded transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-400">Address copied to clipboard</p>}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Amount</label>
              <span className="text-xs text-slate-400">
                Balance: {balance ? Number.parseFloat(balance.formatted).toFixed(4) : "0.0000"} ETH
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                step="0.0001"
                min="0"
              />
              <Button
                onClick={handleMaxClick}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Max
              </Button>
            </div>
          </div>

          {/* Gas Estimate */}
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Gas Estimate</span>
              <span className="text-sm font-semibold text-slate-300">~{gasEstimate} ETH</span>
            </div>
          </div>

          {/* Transfer Button */}
          <Button
            onClick={handleTransfer}
            disabled={!isValidAmount}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Transfer to Smart Account
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
