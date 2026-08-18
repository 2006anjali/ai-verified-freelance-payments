import { Contract, Networks, rpc } from '@stellar/stellar-sdk'
import { STELLAR_CONFIG } from './config'

export const server = new rpc.Server(STELLAR_CONFIG.rpcUrl)

export const networkPassphrase =
  STELLAR_CONFIG.network === 'testnet'
    ? Networks.TESTNET
    : Networks.PUBLIC

export const jobContract = new Contract(
  STELLAR_CONFIG.jobContractId
)

export const escrowContract = new Contract(
  STELLAR_CONFIG.escrowContractId
)
