
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

    const tmeToken = await TME.at("0x871d72C888B7d92686E01e48F6F06FFB11EEe9B5");

    console.log('TME fetched', tmeToken.address)
    // await tmeLocker.setPresaleEnded(true);
    
    var bal = await tmeToken.balanceOf(accounts[0]);
    console.log("bal", bal.toString());
    const addresses = [
      "0x46B8FfC41F26cd896E033942cAF999b78d10c277"
      // "0x8EF9A1A12e0B7E92f11d112f51Ae1054Ddc0E37D", //signer
      // "0x1E18b8B6F27568023E0b577CBEE1889391B2F444",
      // "0xcBe3b6Ae15CCB4592f450fd5aac32cb19ACFAd72",
      // "0x5ea5cc3A18Ee0E5aAFed07826bfd7430e1B62379",
      // "0x032dA9D10962499Bf8694596d747cb85503eccf8",
      // "0x6CF51FDeF74d02296017A1129086Ee9C3477DC01",
      // "0xB3c6144c929652D6046c01282FA2F355D9864dB9",
      // "0xB46638bF5509Fe9B81a69875AeC18aaB00160eB7",
      // "0x9787b0652B26A2916C561fa5256A90B04D088898",
      // "0x610C02e213496259DAeF68d8413CF13ce6306511",
      // "0x53E92Fb32920a307440b84A4246220093197A28D",
      // "0x750A31fA07184CAf87b6Cce251d2F0D7928BADde",
      // "0x46B8FfC41F26cd896E033942cAF999b78d10c277",
    ]
    let p = []
    for (let a of addresses){
      p.push(tmeToken.transfer(a, ether(5)));
    }
    await Promise.all(p).then((r) => {
      console.log(r)
    })
    callback()
    return
    await tmeLocker.claimToken(0);
    await tmeLocker.claimToken(1);
    // send 5 to mf gatchi
    tmeToken.transfer("0x032dA9D10962499Bf8694596d747cb85503eccf8",ether(5));


    

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