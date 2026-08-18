export const STELLAR_CONFIG = {
  network: import.meta.env.VITE_STELLAR_NETWORK,
  rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL,
  jobContractId: import.meta.env.VITE_JOB_CONTRACT_ID,
  escrowContractId: import.meta.env.VITE_ESCROW_CONTRACT_ID,
}
