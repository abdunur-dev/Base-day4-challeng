"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { WalletConnectionStep } from "./steps/wallet-connection-step"
import { FundSmartAccountStep } from "./steps/fund-smart-account-step"
import { TransactionConfirmationStep } from "./steps/transaction-confirmation-step"
import { TransactionMonitoringStep } from "./steps/transaction-monitoring-step"
import { SuccessStep } from "./steps/success-step"
import { SessionSetupStep } from "./steps/session-setup-step"

export type OnboardingStep =
  | "wallet-connection"
  | "fund-smart-account"
  | "transaction-confirmation"
  | "transaction-monitoring"
  | "success"
  | "session-setup"

export interface OnboardingState {
  currentStep: OnboardingStep
  userAddress: string | null
  smartAccountAddress: string | null
  fundAmount: string
  transactionHash: string | null
  confirmations: number
  totalConfirmations: number
  isLoading: boolean
  error: string | null
}

export function OnboardingFlow() {
  const { address, isConnected } = useAccount()
  const [state, setState] = useState<OnboardingState>({
    currentStep: "wallet-connection",
    userAddress: null,
    smartAccountAddress: null,
    fundAmount: "0",
    transactionHash: null,
    confirmations: 0,
    totalConfirmations: 12,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (address && address !== state.userAddress) {
      setState((prev) => ({ ...prev, userAddress: address }))
    }
  }, [address, state.userAddress])

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const handleWalletConnected = (smartAccountAddr: string) => {
    updateState({
      smartAccountAddress: smartAccountAddr,
      currentStep: "fund-smart-account",
    })
  }

  const handleFundingInitiated = (amount: string) => {
    updateState({
      fundAmount: amount,
      currentStep: "transaction-confirmation",
    })
  }

  const handleTransactionSubmitted = (txHash: string) => {
    updateState({
      transactionHash: txHash,
      currentStep: "transaction-monitoring",
    })
  }

  const handleTransactionConfirmed = () => {
    updateState({
      currentStep: "success",
    })
  }

  const handleContinueToSession = () => {
    updateState({
      currentStep: "session-setup",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {state.currentStep === "wallet-connection" && <WalletConnectionStep onConnected={handleWalletConnected} />}
      {state.currentStep === "fund-smart-account" && state.userAddress && state.smartAccountAddress && (
        <FundSmartAccountStep
          userAddress={state.userAddress}
          smartAccountAddress={state.smartAccountAddress}
          onFundingInitiated={handleFundingInitiated}
        />
      )}
      {state.currentStep === "transaction-confirmation" && state.smartAccountAddress && (
        <TransactionConfirmationStep
          fundAmount={state.fundAmount}
          smartAccountAddress={state.smartAccountAddress}
          onTransactionSubmitted={handleTransactionSubmitted}
        />
      )}
      {state.currentStep === "transaction-monitoring" && state.transactionHash && (
        <TransactionMonitoringStep
          transactionHash={state.transactionHash}
          onTransactionConfirmed={handleTransactionConfirmed}
        />
      )}
      {state.currentStep === "success" && (
        <SuccessStep fundAmount={state.fundAmount} onContinue={handleContinueToSession} />
      )}
      {state.currentStep === "session-setup" && <SessionSetupStep />}
    </div>
  )
}
