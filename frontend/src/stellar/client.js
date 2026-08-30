import {
  Contract,
  Networks,
  rpc,
  TransactionBuilder,
  Account,
  scValToNative,
  BASE_FEE,
  nativeToScVal,
} from '@stellar/stellar-sdk'
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

const SIMULATION_ACCOUNT =
  'GDX2PAZI24O5FSMKDMSAWE7HLQAVLWNU7BTJ5YXPFZTKM56COMKNY2BP'

async function simulateContractCall(contractCall) {
  const account = new Account(SIMULATION_ACCOUNT, '0')

  const transaction = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(contractCall)
    .setTimeout(30)
    .build()

  const prepared = await server.simulateTransaction(transaction)

  if ('error' in prepared) {
    throw new Error(prepared.error)
  }

  if (!prepared.result) {
    throw new Error('Contract returned no result')
  }

  return prepared.result.retval
}

export async function getJob() {
  const operation = jobContract.call('get_job')
  const result = await simulateContractCall(operation)

  const job = scValToNative(result)

  console.log('CONVERTED JOB:', job)

  return job
}

export async function getEscrow(jobId) {
  const operation = escrowContract.call(
    'get_escrow',
    nativeToScVal(BigInt(jobId), { type: 'u64' })
  )

  return simulateContractCall(operation)
}

export async function createJob({
  walletAddress,
  amount,
  freelancerAddress,
  requirements,
  deadline,
  signTransaction,
}) {
  const account = await server.getAccount(walletAddress)

  const operation = jobContract.call(
    'create_job',
    nativeToScVal(walletAddress, { type: 'address' }),
    nativeToScVal(freelancerAddress, { type: 'address' }),
    nativeToScVal(requirements, { type: 'string' }),
    nativeToScVal(BigInt(amount), { type: 'i128' }),
    nativeToScVal(BigInt(deadline), { type: 'u64' }),
  )

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()

  const preparedTransaction = await server.prepareTransaction(transaction)

  const signedXdr = await signTransaction(
    preparedTransaction.toEnvelope().toXDR('base64'),
    walletAddress,
  )

  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    networkPassphrase,
  )

  const response = await server.sendTransaction(signedTransaction)

  return response
}

export async function submitWork({
  walletAddress,
  submissionHash,
  signTransaction,
}) {
  const account = await server.getAccount(walletAddress)

  const operation = jobContract.call(
    'submit_work',
    nativeToScVal(walletAddress, { type: 'address' }),
    nativeToScVal(submissionHash, { type: 'string' }),
  )

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()

  const preparedTransaction = await server.prepareTransaction(transaction)

  const signedXdr = await signTransaction(
    preparedTransaction.toEnvelope().toXDR('base64'),
    walletAddress,
  )

  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    networkPassphrase,
  )

  return server.sendTransaction(signedTransaction)
}
export async function verifyJob({
  verificationResult,
  walletAddress,
  signTransaction,
}) {
  const account = await server.getAccount(walletAddress)

  const operation = jobContract.call(
    'verify_job',
    nativeToScVal(verificationResult, { type: 'bool' }),
  )

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()

  const preparedTransaction =
    await server.prepareTransaction(transaction)

  const signedXdr = await signTransaction(
    preparedTransaction.toEnvelope().toXDR('base64'),
    walletAddress,
  )

  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    networkPassphrase,
  )

  const response = await server.sendTransaction(signedTransaction)

  if (!response.hash) {
    throw new Error('No transaction hash returned')
  }

  // Wait for Stellar transaction confirmation
  for (let i = 0; i < 30; i++) {
    const result = await server.getTransaction(response.hash)

    if (result.status === 'SUCCESS') {
      console.log('VERIFY TRANSACTION SUCCESS:', response.hash)
      return response
    }

    if (result.status === 'FAILED') {
      console.error('VERIFY TRANSACTION FAILED:', result)
      throw new Error('Verification transaction failed')
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  throw new Error(
    'Verification transaction confirmation timed out'
  )
}
