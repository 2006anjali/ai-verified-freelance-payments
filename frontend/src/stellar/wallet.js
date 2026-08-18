import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
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
