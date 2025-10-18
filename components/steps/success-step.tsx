"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Zap } from "lucide-react"

interface SuccessStepProps {
  fundAmount: string
  onContinue: () => void
}

export function SuccessStep({ fundAmount, onContinue }: SuccessStepProps) {
  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Funding Successful!</CardTitle>
          <CardDescription className="text-slate-400">Your smart account is now ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            <p className="text-center text-emerald-300 font-semibold">Smart account now has {fundAmount} BASE ETH</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Gas Sponsorship Ready</p>
                <p className="text-xs text-slate-400">Set up session keys for sponsored transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Account Secured</p>
                <p className="text-xs text-slate-400">Your smart account is protected with ERC-4337</p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Continue to Session Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
