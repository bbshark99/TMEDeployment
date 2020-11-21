
// Contracts
const TMEDeployer = artifacts.require("TMEDeployer")
const TMECrowdsale = artifacts.require("TMECrowdsale")
const TME = artifacts.require("TME")
const TMELocker = artifacts.require("TMELocker")
const IUniswapPair = artifacts.require("IUniswapPair")
const IUnicrypt = artifacts.require("IUnicrypt")
const TMETimeLock = artifacts.require("TMETimeLock");
// Utils
const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

module.exports = async function(callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)

    const tmeLocker = await TMELocker.deployed();
    const tmeCrowdsale = await TMECrowdsale.deployed();
    const tmeToken = await TME.deployed();
    const tmeTimeLock = await TMETimeLock.deployed();
    
    console.log('TMECrowdsale fetched', tmeCrowdsale.address)
    console.log('TME fetched', tmeToken.address)
    console.log('TMELocker fetched', tmeLocker.address)
    console.log('TMETimeLock', tmeTimeLock.address);
    // await tmeTimeLock.setTokenAdd(tmeToken.address);
    
    var accBal = await tmeToken.balanceOf(accounts[0]);
    console.log("bal", accBal.toString());

    

    // await tmeTimeLock.claimToken(0);

    const now = Math.floor(Date.now()/1000);
    console.log("now", now);
    await tmeToken.approve(tmeTimeLock.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    const allowance = await tmeToken.allowance(accounts[0],tmeTimeLock.address);
    console.log("time lock allowance", allowance.toString());

    await tmeTimeLock.lock(ether(600), now + (3600 * 24 * 7));
    console.log("locked");

    
    var accBal = await tmeToken.balanceOf(accounts[0]);
    console.log("accBal", accBal.toString());

    
    var timelockBal = await tmeToken.balanceOf(tmeTimeLock.address);
    console.log("timeLockBal", timelockBal.toString());

    var numBatches = await tmeTimeLock.numBatches();
    for (var i = 0; i < numBatches; i+=1){
      batches = await tmeTimeLock.batches(i);
      console.log(batches.owner, batches.amount.toString(), batches.time.toString(), batches.spent)
    }


  }
  catch(error) {
    console.log(error)
  }

  callback()
}