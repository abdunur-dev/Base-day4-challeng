"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Lock, Zap } from "lucide-react"

export function SessionSetupStep() {
  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Session Permissions</CardTitle>
          <CardDescription className="text-slate-400">Configure your session keys and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Key Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Session Key Generated</p>
                <p className="text-xs text-slate-400 mt-1">Your session key is ready for transaction signing</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Gas Sponsorship Enabled</p>
                <p className="text-xs text-slate-400 mt-1">Your transactions will be sponsored by the paymaster</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Permissions Configured</p>
                <p className="text-xs text-slate-400 mt-1">Session has full transaction permissions</p>
              </div>
            </div>
          </div>

          {/* Permissions Summary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Active Permissions</label>
            <div className="space-y-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 w-full justify-start">
                ✓ Execute Transactions
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 w-full justify-start">
                ✓ Sponsored Gas
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 w-full justify-start">
                ✓ Session Active
              </Badge>
            </div>
          </div>

          {/* Activate Button */}
          <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2 rounded-lg transition-all">
            Activate Session
          </Button>

          {/* Info Message */}
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400">
              Your smart account is now fully set up and ready for transactions with gas sponsorship enabled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
