// cron-jobs.ts
import cron from 'node-cron'
import { TokenLogCrawler } from '../services/crawl.service'
import deploydetails from '../contract/deploydetails.json'
import MyToken from '../contract/MyToken.json'
import ContractModel from '../model/Contract'

export const TokenLogJob = () => {
 cron.schedule(
  '*/15 * * * * *',
  async () => {
   try {
    const contractName = 'MyToken'
    const providerUrl = `https://sepolia.infura.io/v3/9d13fab540c243ca9514d4ab4fe7e9e1`
    if (!providerUrl) {
     throw new Error('RPC_URL is not defined in environment variables')
    }

    const crawler = new TokenLogCrawler(
     providerUrl,
     deploydetails.sepolia.MyToken.address,
     MyToken.abi,
    )

    const lastBlockRecord = await ContractModel.findOne({
     contractName,
    })

    let fromBlock = 0

    if (!lastBlockRecord) {
     fromBlock =
      (await crawler.getDeploymentBlock(
       deploydetails.sepolia.MyToken.transaction,
      )) ?? deploydetails.sepolia.MyToken.block
     await ContractModel.create({
      block: fromBlock,
      contractName,
     })
    } else if (lastBlockRecord.block < deploydetails.sepolia.MyToken.block) {
     fromBlock = deploydetails.sepolia.MyToken.block
     await ContractModel.updateOne(
      { contractName: 'MyToken' },
      { block: deploydetails.sepolia.MyToken.block },
     )
    } else {
     fromBlock = lastBlockRecord.block
    }

    const latestBlock = await crawler.getLatestBlockNumber()
    if (latestBlock !== undefined) {
     await crawler.crawlTokenLogs(fromBlock, latestBlock)
     await ContractModel.updateOne(
      {
       contractName,
      },
      { block: latestBlock },
     )
    }
   } catch (error) {
    console.error('Error occurred while crawling token logs:', error)
   }
  },
  {
   scheduled: true,
   timezone: 'America/New_York',
  },
 )
}
