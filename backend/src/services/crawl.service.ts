import { ethers, parseUnits } from 'ethers'
import { ITokenLog } from '../interfaces/token-log.interface'
import TokenLogModel from '../model/Token'

export class TokenLogCrawler {
 private provider: ethers.JsonRpcProvider
 private contract: ethers.Contract
 private tokenModel = TokenLogModel

 constructor(providerUrl: string, contractAddress: string, contractABI: any) {
  this.provider = new ethers.JsonRpcProvider(providerUrl)
  this.contract = new ethers.Contract(
   contractAddress,
   contractABI,
   this.provider,
  )
 }

 async saveTokenLog(data: ITokenLog) {
  try {
   await this.tokenModel.updateOne(
    { transactionHash: data.transactionHash },
    { $set: data },
    { upsert: true },
   )
  } catch (error) {
   console.error('Error saving token log:', error)
  }
 }

 async crawlTokenLogs(fromBlock: number, toBlock: number) {
  try {
   const filter = this.contract.filters.Transfer()
   const logs = await this.contract.queryFilter(filter, fromBlock, toBlock)
   for (const log of logs) {
    try {
     const decodedLog = this.contract.interface.decodeEventLog(
      'Transfer',
      log.data,
      log.topics,
     )

     const { from, to, value } = decodedLog
     const tx = await log.getTransaction()
     const gasPrice = tx.gasPrice
     const block = await log.getBlock()
     const timestamp = block.timestamp

     await this.saveTokenLog({
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      from,
      to,
      value: `${ethers.formatUnits(value, 'ether')}`,
      gasPrice: {
       value: `${ethers.formatUnits(gasPrice, 'ether')}`,
       unit: 'eth',
      },
      timestamp,
     })
    } catch (decodeError) {
     console.error('Error decoding log:', decodeError)
    }
   }
  } catch (error) {
   console.error('Error fetching logs:', error)
  }
 }
 async getDeploymentBlock(transactionHash: string) {
  try {
   const receipt = await this.provider.getTransactionReceipt(transactionHash)

   if (receipt && receipt.blockNumber) {
    console.log(`Contract deployed at block: ${receipt.blockNumber}`)
    return receipt.blockNumber
   } else {
    console.log(
     'Transaction receipt not found or block number is not available.',
    )
    return null
   }
  } catch (error) {
   console.error('Error fetching transaction receipt:', error)
   return null
  }
 }

 async getLatestBlockNumber() {
  try {
   const latestBlockNumber = await this.provider.getBlockNumber()
   console.log(`Latest Block Number: ${latestBlockNumber}`)
   return latestBlockNumber
  } catch (error) {
   console.error('Error fetching the latest block number:', error)
  }
 }
}
