const hre = require('hardhat')
const fs = require('fs')
const path = require('path')

require('@nomicfoundation/hardhat-toolbox')

async function main() {
 if (hre.network.name === 'hardhat') {
  console.warn(
   'You are deploying to the Hardhat Network, which resets on every run. Use "--network localhost" for persistence.',
  )
 }

 const [deployer] = await hre.ethers.getSigners()
 const networkName = hre.network.name
 const explorerUrl = getExplorerUrl(networkName)

 const balance = await hre.ethers.provider.getBalance(deployer.address)
 const balanceInEth = hre.ethers.formatEther(balance)
 console.log(`💰 Deployer balance: ${balanceInEth} ETH`)

 if (balance < hre.ethers.parseEther('0.05')) {
  console.error('❌ Not enough balance! You need at least 0.05 ETH to deploy.')
  return
 }

 console.log('🚀 Deploying contracts with account:', deployer.address)

 try {
  const MyToken = await hre.ethers.getContractFactory('MyToken')
  const myToken = await MyToken.deploy()
  const myTokenTx = await myToken.deploymentTransaction()
  await myToken.waitForDeployment()
  const myTokenAddress = await myToken.getAddress()
  const myTokenReceipt = await hre.ethers.provider.getTransactionReceipt(
   myTokenTx.hash,
  )
  const myTokenBlock = myTokenReceipt.blockNumber

  console.log(`✅ MyToken deployed to: ${myTokenAddress}`)
  console.log(`🔗 Transaction: ${explorerUrl}/tx/${myTokenTx.hash}`)
  console.log(`📦 Deployed in block: ${myTokenBlock}`)

  saveDeploymentDetails({
   network: networkName,
   contracts: {
    MyToken: {
     address: myTokenAddress,
     explorer: `${explorerUrl}/address/${myTokenAddress}`,
     transaction: `${explorerUrl}/tx/${myTokenTx.hash}`,
     block: myTokenBlock,
    },
   },
  })

  saveContractArtifacts('MyToken')
 } catch (error) {
  console.error('[ERROR]:', error)
 }
}

function saveDeploymentDetails(data) {
 const deploymentsDir = path.join(__dirname, '..', '..', 'contract')

 if (!fs.existsSync(deploymentsDir)) {
  fs.mkdirSync(deploymentsDir, { recursive: true })
 }

 const filePath = path.join(deploymentsDir, 'deploydetails.json')

 let existingData = {}
 if (fs.existsSync(filePath)) {
  existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
 }

 existingData[data.network] = data.contracts

 fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))

 console.log(`📁 Deployment details saved to: ${filePath}`)
}

function saveContractArtifacts(contractName) {
 const artifactsDir = path.join(__dirname, '..', '..', 'contract')

 if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true })
 }

 const artifact = hre.artifacts.readArtifactSync(contractName)
 const artifactPath = path.join(artifactsDir, `${contractName}.json`)

 fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2))

 console.log(
  `📁 Full contract artifact saved for ${contractName} at: ${artifactPath}`,
 )
}

function getExplorerUrl(network) {
 const explorers = {
  sepolia: 'https://sepolia.etherscan.io',
  lineaSepolia: 'https://sepolia.lineascan.build',
  bnb: 'https://testnet.bscscan.com',
  bnbv2: 'https://testnet.bscscan.com',
 }
 return explorers[network] || 'https://etherscan.io'
}

main()
 .then(() => process.exit(0))
 .catch((error) => {
  console.error(error)
  process.exit(1)
 })
