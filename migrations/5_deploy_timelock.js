const TMETimeLock = artifacts.require('./TMETimeLock.sol')
const TME = artifacts.require('./TME.sol')
require('dotenv').config()

module.exports = async (deployer, network, accounts) => {
  let deployAddress = accounts[0] // by convention
  const token = await TME.deployed();

  console.log('deploying from:' + deployAddress)
  console.log('TME:' + token.address)

  await deployer.deploy(TMETimeLock, token.address, {
    from: deployAddress
  });
}
