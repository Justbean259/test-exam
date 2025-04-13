const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MyToken (Self Mint Only)', function () {
 let Token, token, owner, addr1, addr2

 beforeEach(async () => {
  ;[owner, addr1, addr2] = await ethers.getSigners()

  Token = await ethers.getContractFactory('MyToken')
  token = await Token.deploy()
  await token.waitForDeployment()
 })

 it('Should have correct name and symbol', async () => {
  expect(await token.name()).to.equal('MyToken')
  expect(await token.symbol()).to.equal('MYT')
 })

 it('Should allow user to mint tokens for themselves', async () => {
  const mintAmount = ethers.parseEther('1000')
  await token.connect(addr1).mint(mintAmount)
  const balance = await token.balanceOf(addr1.address)
  expect(balance).to.equal(mintAmount)
 })

 it('Should not allow minting zero tokens', async () => {
  await expect(token.connect(addr1).mint(0)).to.be.revertedWith(
   'Amount must be greater than 0',
  )
 })

 it('Should allow transfer of tokens between users', async () => {
  const amount = ethers.parseEther('500')

  await token.connect(addr1).mint(amount)
  await token.connect(addr1).transfer(addr2.address, ethers.parseEther('200'))

  const bal1 = await token.balanceOf(addr1.address)
  const bal2 = await token.balanceOf(addr2.address)

  expect(bal1).to.equal(ethers.parseEther('300'))
  expect(bal2).to.equal(ethers.parseEther('200'))
 })

 it('Should not allow transfer more than balance', async () => {
  await expect(
   token.connect(addr1).transfer(addr2.address, ethers.parseEther('1')),
  ).to.be.revertedWithCustomError(token, 'ERC20InsufficientBalance')
 })
})
