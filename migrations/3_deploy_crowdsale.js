const TMECrowdsale = artifacts.require('./TMECrowdsale.sol')
const TME = artifacts.require('./TME.sol')
const TMELocker = artifacts.require('./TMELocker.sol')
require('dotenv').config()  // Store environment-specific variable from '.env' to process.env
module.exports =  async (deployer, network, accounts) => {

  let deployAddress = accounts[0] // by convention
  console.log('Preparing for deployment of TMECrowdsale...')

  console.log('deploying from:' + deployAddress)

  const token = await TME.deployed();

  await deployer.deploy(TMECrowdsale, 3, "1000000000000000000", "60000000000000000000",
  token.address, {
    from: deployAddress
  });

  await deployer.deploy(TMELocker,
    process.env.UNISWAP_ROUTER_ADD, 
    process.env.UNISWAP_FACTORY_ADD,
    process.env.UNICRYPT_ADD, 
    deployAddress,
    process.env.TREASURY_ADD,
    token.address, {
    from: deployAddress
  })
  
}
