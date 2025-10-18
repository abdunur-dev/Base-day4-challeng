// Smart account address generation utility
// In production, this would use a proper smart account factory

export function generateSmartAccountAddress(eoaAddress: string): string {
  // Simulate deterministic smart account address generation
  // In production, this would call the actual smart account factory contract
  const hash = Array.from(eoaAddress)
    .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    .toString(16)
    .padStart(40, "0")

  return `0x${hash.slice(-40)}`
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatBalance(balance: string, decimals = 4): string {
  return Number.parseFloat(balance).toFixed(decimals)
}
