
// Contracts
const TME = artifacts.require("TME")
const TMELocker = artifacts.require("TMELocker")
const TMETimeLock = artifacts.require("TMETimeLock");
const TMECrowdsale = artifacts.require("TMECrowdsale");
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
    const treasuryAdd = await tmeLocker.treasury();

    console.log('TMECrowdsale fetched', tmeCrowdsale.address)
    console.log('TME fetched', tmeToken.address)
    console.log('TMELocker fetched', tmeLocker.address)
    console.log('tmeTimeLock', tmeTimeLock.address)
    console.log('treasuryAdd',treasuryAdd)

    let treasuryBal = await tmeToken.balanceOf(treasuryAdd);
    console.log("treasuryBal",treasuryBal.toString())
    // claim
    await tmeTimeLock.claimToken(0);
    let treasuryBal2 = await tmeToken.balanceOf(treasuryAdd);
    console.log("treasuryBal",treasuryBal2.toString())
    callback();
    return;
    var devBal = await tmeToken.balanceOf(accounts[0]);
    console.log("devBal", devBal.toString());


    // callback()
    // return
    // await tmeLocker.claimToken(0);
    // await tmeLocker.claimToken(1);
    await tmeLocker.claimToken(2);
    // send 4 to mf gatchi
    await tmeToken.transfer("0x032dA9D10962499Bf8694596d747cb85503eccf8",ether(4));

    // send 2 to luk
    await tmeToken.transfer("0x7F09373EEACeE72F0EDBd286C609C59cAF155661",ether(2));

    
    // var treasuryBal = await tmeToken.balanceOf(process.env.TREASURY_ADD);
    // console.log("treasuryBal", treasuryBal.toString());

    var devBal = await tmeToken.balanceOf(accounts[0]);
    console.log("devBal", devBal.toString());



    // const tmeTimeLock = await TMETimeLock.deployed();
    // console.log('TMETimeLock', tmeTimeLock.address);
    // await tmeTimeLock.setTokenAdd(tmeToken.address);

    // const now = Math.floor(Date.now()/1000);
    // console.log("now", now);
    // await tmeToken.approve(tmeTimeLock.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    // const allowance = await tmeToken.allowance(accounts[0],tmeTimeLock.address);
    // console.log("time lock allowance", allowance.toString());

    // await tmeTimeLock.lock(ether(1), now+60);
    // console.log("locked");

    
    // var devBal = await tmeToken.balanceOf(accounts[0]);
    // console.log("devBal", devBal.toString());

    
    // var timelockBal = await tmeToken.balanceOf(tmeTimeLock.address);
    // console.log("timeLockBal", timelockBal.toString());

    // var numBatches = await tmeTimeLock.numBatches();
    // for (var i = 0; i < numBatches; i+=1){
    //   batches = await tmeTimeLock.batches(i);
    //   console.log(batches.owner, batches.amount.toString(), batches.time.toString(), batches.spent)
    // }


  }
  catch(error) {
    console.log(error)
  }

  callback()
}