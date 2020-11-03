const TME = artifacts.require('./TME.sol')
require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = (deployer, network, accounts) => {
  let deployAddress = accounts[0] // by convention
  console.log('Preparing for deployment of TME...')

  console.log('deploying from:' + deployAddress)


  // deployer.deploy(TMEDeployer, treasury, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D','0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', unicrypt, {
  deployer.deploy(TME, "1000000000000000000000", {
    from: deployAddress
  })
}
