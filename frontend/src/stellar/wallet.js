import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from '@stellar/freighter-api'

export async function connectWallet() {
  const connected = await isConnected()

  if (!connected) {
    throw new Error('Freighter wallet is not installed or not connected.')
  }

  await requestAccess()

  const addressResult = await getAddress()
  const networkResult = await getNetwork()

  return {
    address: addressResult.address,
    network: networkResult.network,
  }
}

export async function signWalletTransaction(xdr, address) {
  const networkResult = await getNetwork()

  const result = await signTransaction(xdr, {
    network: networkResult.network,
    networkPassphrase: networkResult.networkPassphrase,
    address,
  })

  if (result.error) {
    throw new Error(result.error)
  }

  return result.signedTxXdr
}
