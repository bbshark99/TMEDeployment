const TMELocker = artifacts.require('./TMELocker.sol')
const TMECrowdsale = artifacts.require('./TMECrowdsale.sol')
const TME = artifacts.require('./TME.sol')
require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = async (deployer, network, accounts) => {
  let deployAddress = accounts[0] // by convention
  console.log('Preparing for setup...')
  console.log('setup from:' + deployAddress)

  const token = await TME.deployed();
  const crowdsale = await TMECrowdsale.deployed();
  const locker = await TMELocker.deployed();
  console.log(token.address, crowdsale.address, locker.address)
  await crowdsale.setTMELocker(locker.address);
  await token.transfer(crowdsale.address, "180000000000000000000");
  await token.transfer(locker.address, "820000000000000000000");

}
