"use client"

import { useState, useEffect } from "react"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface TransactionConfirmationStepProps {
  fundAmount: string
  smartAccountAddress: string | null
  onTransactionSubmitted: (txHash: string) => void
}

export function TransactionConfirmationStep({
  fundAmount,
  smartAccountAddress,
  onTransactionSubmitted,
}: TransactionConfirmationStepProps) {
  const { sendTransaction, isPending: isSigning, data: hash, error: sendError } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const [error, setError] = useState<string | null>(null)
  const [transactionSubmitted, setTransactionSubmitted] = useState(false)

  useEffect(() => {
    if (hash && !transactionSubmitted) {
      setTransactionSubmitted(true)
      onTransactionSubmitted(hash)
    }
  }, [hash, transactionSubmitted, onTransactionSubmitted])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConfirm = async () => {
    if (!smartAccountAddress || !fundAmount) return

    try {
      setError(null)
      sendTransaction({
        to: smartAccountAddress as `0x${string}`,
        value: parseEther(fundAmount),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const getButtonState = () => {
    if (isSigning) {
      return {
        text: "Waiting for signature...",
        disabled: true,
        icon: <Loader className="w-4 h-4 animate-spin" />,
      }
    }
    if (isConfirming) {
      return {
        text: "Confirming transaction...",
        disabled: true,
        icon: <Loader className="w-4 h-4 animate-spin" />,
      }
    }
    if (isConfirmed) {
      return {
        text: "Transaction confirmed!",
        disabled: true,
        icon: <CheckCircle className="w-4 h-4" />,
      }
    }
    return {
      text: "Confirm in Wallet",
      disabled: false,
      icon: null,
    }
  }

  const buttonState = getButtonState()

  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Confirm Transaction</CardTitle>
          <CardDescription className="text-slate-400">Review and confirm your transaction details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Amount</label>
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-2xl font-bold text-white">{fundAmount} ETH</p>
            </div>
          </div>

          {/* To Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">To Address</label>
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <code className="text-sm text-purple-400 font-mono">
                {smartAccountAddress ? formatAddress(smartAccountAddress) : "Loading..."}
              </code>
            </div>
          </div>

          {/* Gas Fee */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Gas Fee</label>
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">~0.0001 ETH</p>
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Total</span>
              <span className="text-lg font-bold text-white">
                {(Number.parseFloat(fundAmount) + 0.0001).toFixed(4)} ETH
              </span>
            </div>
          </div>

          {/* Transaction Hash Display */}
          {hash && (
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Transaction Hash</span>
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  View on BaseScan ↗
                </a>
              </div>
              <code className="text-xs text-slate-300 font-mono break-all">{hash}</code>
            </div>
          )}

          {/* Error Message */}
          {(error || sendError) && (
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error || sendError?.message}</p>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={buttonState.disabled}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              {buttonState.icon}
              {buttonState.text}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
