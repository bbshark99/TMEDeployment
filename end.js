
// Contracts
const TMEDeployer = artifacts.require("TMEDeployer")
const TMECrowdsale = artifacts.require("TMECrowdsale")
const TME = artifacts.require("TME")
const TMELocker = artifacts.require("TMELocker")
const IUniswapPair = artifacts.require("IUniswapPair")
const IUnicrypt = artifacts.require("IUnicrypt")
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

    const tmeLocker = await TMELocker.deployed();
    const tmeCrowdsale = await TMECrowdsale.deployed();
    const tmeToken = await TME.deployed();
    const treasuryAdd = await tmeLocker.treasury();


    console.log('TMECrowdsale fetched', tmeCrowdsale.address)
    console.log('TME fetched', tmeToken.address)
    console.log('TMELocker fetched', tmeLocker.address)
    await tmeLocker.setPresaleEnded(true);

    // end crowdsale
    var amtTokenLeft = await tmeCrowdsale.amtTokenLeft();
    console.log("amtTokenLeft",amtTokenLeft/1E18)

    await tmeCrowdsale.claimUnsoldTokens();
    
    var balTmeLocker = await tmeToken.balanceOf(tmeLocker.address);
    console.log("balTmeLocker",balTmeLocker/1E18)
    
    const postsalesEnded = await tmeLocker.postsalesEnded();
    if (!postsalesEnded){
      const receipt = await tmeLocker.postCrowdSale();
      // console.log(receipt)
      
      batches = await tmeLocker.batches(11);
      console.log(batches.owner, batches.amount.toString(), batches.time.toString(), batches.spent)
      
    }



    uniswapPairAdd = await tmeLocker.uniswapPair();
    const uniswapPair = await IUniswapPair.at(uniswapPairAdd);
    var lockBal = await uniswapPair.balanceOf(tmeLocker.address);
    console.log("lockPairBal",lockBal/1E18)

    const token0 = await uniswapPair.token0()
    const token1 = await uniswapPair.token1()
    const reserves = await uniswapPair.getReserves()
    const totalSupply = await uniswapPair.totalSupply()

    console.log(token0, token1, reserves.reserve0.toString(), reserves.reserve1.toString(), totalSupply.toString())

    const polAddress = await tmeLocker.pol();
    console.log("pol",polAddress)
    if (polAddress != "0x0000000000000000000000000000000000000000"){

      const pol = await IUnicrypt.at(process.env.UNICRYPT_ADD)
      const lockInfo = await pol.getTokenReleaseAtIndex(uniswapPairAdd,0);
      // console.log(lockInfo)
      console.log("lockInfo", lockInfo[0].toString(), lockInfo[1].toString())
      
      const lockInfo2 = await pol.getUserTokenInfo(uniswapPairAdd, tmeLocker.address)
      // console.log(lockInfo2)
      console.log("lockInfo2", lockInfo2[0].toString(), lockInfo2[1].toString(), lockInfo2[2].toString())
      
      const lockInfo3 = await pol.getUserVestingAtIndex(uniswapPairAdd, tmeLocker.address, 0);
      console.log("lockInfo3", lockInfo3[0].toString(), lockInfo3[1].toString())
    }

    
    // // try withdraw
    // var amtLPlocked = await tmeLocker.amtLPlocked();
    // console.log("amtLPlocked",amtLPlocked.toString());
    // var tx = await tmeLocker.claimLiquidity();
    // // console.log(tx)
    // var devBal = await uniswapPair.balanceOf(accounts[0]);
    // console.log("devBalLP", devBal.toString());

    // withdraw treasury
    
    // await tmeLocker.claimToken(0);
    // await tmeLocker.claimToken(1);
    // await tmeLocker.claimToken(2);
    // await tmeLocker.claimToken(3);
    // await tmeLocker.claimToken(4);
    // await tmeLocker.claimToken(5);
    // await tmeLocker.claimToken(6);
    // await tmeLocker.claimToken(7);
    // await tmeLocker.claimToken(8);
    // await tmeLocker.claimToken(9);
    // await tmeLocker.claimToken(10);
    // await tmeLocker.claimToken(11);
      
    
    
    var treasuryBal = await tmeToken.balanceOf(process.env.TREASURY_ADD);
    console.log("treasuryBal", treasuryBal.toString());

    var devBal = await tmeToken.balanceOf(accounts[0]);
    console.log("devBal", devBal.toString());

  }
  catch(error) {
    console.log(error)
  }

  callback()
}