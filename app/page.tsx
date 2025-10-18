'use client';

import { useState } from 'react';
import { useSendTransaction, useAccount, useBalance, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function FundSmartAccount() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [amount, setAmount] = useState('');
  
  const {
    data: hash,
    sendTransaction,
    isPending: isSending,
    isSuccess: isSent,
    error: sendError
  } = useSendTransaction();
  
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransaction({ hash });
  
  // Your actual wallet address
  const smartAccountAddress = '0x28e831e506c645d255A9A2f68Cf273eb47Ea63c8';
  
  const handleTransfer = () => {
    if (!amount || !smartAccountAddress) return;
    
    sendTransaction({
      to: smartAccountAddress,
      value: parseEther(amount),
    });
  };
  
  const handleMax = () => {
    if (balance) {
      // Leave 0.0001 ETH for gas fees
      const maxAmount = parseFloat(balance.formatted) - 0.0001;
      if (maxAmount > 0) {
        setAmount(maxAmount.toFixed(6));
      }
    }
  };
  
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Please connect your wallet to fund your smart account</p>
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-yellow-400 text-sm mt-4">
            Click the MetaMask extension in your browser to connect
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md mx-auto pt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Fund Your Smart Account</h1>
          <p className="text-gray-400">Transfer ETH from your wallet to your smart account</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          {/* From Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">From</label>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
              <div className="text-white font-mono text-sm">{formatAddress(address || '')}</div>
              <div className="text-gray-500 text-xs mt-1">Your EOA • Connected ✅</div>
            </div>
          </div>

          {/* To Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">To</label>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
              <div className="text-white font-mono text-sm">{formatAddress(smartAccountAddress)}</div>
              <div className="text-gray-500 text-xs mt-1">Your Smart Account</div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount <span className="text-gray-500">Balance: {balance ? parseFloat(balance.formatted).toFixed(4) : '0'} ETH</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 pr-20 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleMax}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Gas Estimate */}
          <div className="mb-6 p-3 bg-gray-900/30 rounded-lg border border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gas Estimate</span>
              <span className="text-white">~0.0001 ETH</span>
            </div>
          </div>

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            disabled={isSending || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isSending ? 'Confirm in MetaMask...' : 'Transfer to Smart Account'}
          </button>

          {/* Error Message */}
          {sendError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">Error: {sendError.message}</p>
            </div>
          )}

          {/* Transaction Status */}
          {hash && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Transaction Status</h3>
              
              {isSending && (
                <div className="flex items-center text-yellow-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                  Waiting for confirmation in wallet...
                </div>
              )}

              {isSent && isConfirming && (
                <div className="flex items-center text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                  Transaction confirming... (0/12)
                </div>
              )}

              {isConfirmed && (
                <div className="flex items-center text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707-9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Transaction confirmed! (12/12)
                </div>
              )}

              {/* Transaction Hash */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Transaction Hash:</span>
                <a 
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-mono flex items-center"
                >
                  {hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : ''}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Success Message */}
              {isConfirmed && (
                <div className="mt-3 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-sm">
                    ✅ Success! Your smart account has been funded with {amount} ETH.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Network Info */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Base Sepolia Testnet
          </div>
        </div>
      </div>
    </div>
  );
}