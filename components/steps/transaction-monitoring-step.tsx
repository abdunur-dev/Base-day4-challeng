"use client"

import { useEffect, useState } from "react"
import { usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle2, Clock } from "lucide-react"

interface TransactionMonitoringStepProps {
  transactionHash: string | null
  onTransactionConfirmed: () => void
}

export function TransactionMonitoringStep({ transactionHash, onTransactionConfirmed }: TransactionMonitoringStepProps) {
  const publicClient = usePublicClient()
  const [confirmations, setConfirmations] = useState(0)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [txBlockNumber, setTxBlockNumber] = useState<number | null>(null)

  const totalConfirmations = 12

  useEffect(() => {
    if (!transactionHash || !publicClient) return

    const pollConfirmations = async () => {
      try {
        // Get current block number
        const currentBlock = await publicClient.getBlockNumber()
        setBlockNumber(Number(currentBlock))

        // Get transaction receipt
        const receipt = await publicClient.getTransactionReceipt({
          hash: transactionHash as `0x${string}`,
        })

        if (receipt) {
          const txBlock = Number(receipt.blockNumber)
          setTxBlockNumber(txBlock)
          const confirmationCount = Number(currentBlock) - txBlock
          setConfirmations(confirmationCount)

          if (confirmationCount >= totalConfirmations) {
            setIsConfirmed(true)
            onTransactionConfirmed()
          }
        }
      } catch (error) {
        console.error("Error polling confirmations:", error)
      }
    }

    // Poll immediately and then every 2 seconds
    pollConfirmations()
    const interval = setInterval(pollConfirmations, 2000)

    return () => clearInterval(interval)
  }, [transactionHash, publicClient, onTransactionConfirmed])

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const baseScanUrl = `https://sepolia.basescan.org/tx/${transactionHash}`

  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Transaction Monitoring</CardTitle>
          <CardDescription className="text-slate-400">Waiting for blockchain confirmation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Hash */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Transaction Hash</label>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <code className="text-sm text-blue-400 font-mono">
                {transactionHash ? formatHash(transactionHash) : "Loading..."}
              </code>
              {transactionHash && (
                <a
                  href={baseScanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                  title="View on BaseScan"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Confirmation Status */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Confirmations</label>
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isConfirmed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                  <span className="text-lg font-semibold text-white">
                    {confirmations}/{totalConfirmations}
                  </span>
                </div>
                {isConfirmed && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Confirmed</Badge>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((confirmations / totalConfirmations) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300">
              {isConfirmed
                ? "✅ Transaction confirmed! Your smart account has been funded."
                : `⏳ Waiting for confirmations... ${confirmations}/${totalConfirmations}`}
            </p>
          </div>

          {/* BaseScan Link */}
          {transactionHash && (
            <a
              href={baseScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-3 text-center bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 text-blue-400 text-sm font-medium transition-colors"
            >
              View on BaseScan →
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
