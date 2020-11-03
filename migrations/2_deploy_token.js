const TME = artifacts.require('./TME.sol')
require('dotenv').config()

module.exports = (deployer, network, accounts) => {
  let deployAddress = accounts[0] // by convention
  console.log('Preparing for deployment of TME...')

  console.log('deploying from:' + deployAddress)


  deployer.deploy(TME, "1000000000000000000000", {
    from: deployAddress
  })
}
