pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./IUnicrypt.sol";

contract TMELocker is Ownable {
    using SafeMath for uint256;

    address public uniswapPair;
    address payable public treasury;
    address public tokenAdd;
    address payable public devAddress;
    bool public readyForSale;
    uint256 public amtLPlocked;

    uint256 oneWeekSeconds = 7 * 86400;
    uint256 twoYearSeconds = 63072000;
    
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Factory public uniswapFactory;
    IUnicrypt public pol;

    bool public ended;

    event Receive(uint256 amt);
    event Locked(address pair, uint256 amtLocked, uint256 releaseTime);
    event BatchLocked(address owner, uint256 amtLocked, uint256 releaseTime);

    constructor(address _router, address _factory, address _pol, 
        address payable _dev,
        address payable _treasury, address _token) public{
        treasury = _treasury;
        devAddress = _dev;
        uniswapRouter = IUniswapV2Router02(_router);
        uniswapFactory = IUniswapV2Factory(_factory);
        pol = IUnicrypt(_pol);
        tokenAdd = _token;

        readyForSale = false;
    }

    receive () external payable  {
        emit Receive(msg.value);
    }
    
    function setTokenAdd(address t) onlyOwner public{
        tokenAdd = t;
    }
    function setTreasury(address payable t) onlyOwner public{
        treasury = t;
    }
    function setDevAddress(address payable t) onlyOwner public{
        devAddress = t;
    }
    function isReadyForSale() public view returns (bool){
        return readyForSale;
    }

    struct Batch {
        address owner;
        uint256 amount;
        uint256 time;
        bool spent;
    }
    
    Batch[] public batches;

    // get ready for crowdsale by locking up treasury + dev funds
    function getReadyForCrowdSale() public onlyOwner returns (bool) {
        require(!readyForSale, "Already ready for sale!");
        // check i have treasury funds of 600
        // check i have dev funds of 100
        // check i have uniswap funds of 120
        require(tokenAdd != address(0), "Please set tokenadd");
        IERC20 tokenContract = IERC20(tokenAdd);
        require(tokenContract.balanceOf(address(this)) == 820000000000000000000, "Expected 820 tokens...");

        timeLockAll();
        readyForSale = true;
    }
    function timeLockAll() internal {

        // treasury: 600 for a week
        batches.push(Batch(treasury, 600000000000000000000, block.timestamp + oneWeekSeconds, false));

        // dev funds:  10 a week for 10 weeks
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds, false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(2), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(3), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(4), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(5), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(6), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(7), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(8), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(9), false));
        batches.push(Batch(devAddress, 10000000000000000000, block.timestamp + oneWeekSeconds.mul(10), false));
    }


   
   
    // to be called after crowdsale ends
    function postCrowdSale() public onlyOwner{
        require(!ended, "ended");
       // make the pair to get the address
        uniswapPair = uniswapFactory.createPair(
            address(uniswapRouter.WETH()),
            tokenAdd
        );

        uint256 totalETHContributed = address(this).balance;
        uint256 amtDesiredToken = totalETHContributed.mul(2);
        require(amtDesiredToken <= amtToken(), "Unexpected token balance");

        IERC20(tokenAdd).approve(address(uniswapRouter), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

        // add liquidity
        (,, uint amtLP) = uniswapRouter.addLiquidityETH{value: totalETHContributed}(tokenAdd, amtDesiredToken, 0, 0, address(this), block.timestamp);

        uint amtLPheld = IUniswapV2Pair(uniswapPair).balanceOf(address(this));
        require(amtLPheld == amtLP , "amt LP is different!");

        amtLPlocked = amtLPheld;

        IUniswapV2Pair(uniswapPair).approve(address(pol),amtLPheld);
        // lock liquidity
        pol.depositToken(uniswapPair, amtLPheld, block.timestamp.add(twoYearSeconds));
        emit Locked(uniswapPair, amtLPheld, block.timestamp.add(twoYearSeconds));

        IERC20 token = IERC20(tokenAdd);

        // remaining tokens sent to treasury
        

        uint256 totalPresaleAmt = 180 ether;
        uint256 totalTokensForUni = 120 ether;
        uint256 unsoldTokens = totalPresaleAmt.sub(totalETHContributed.mul(3));
        uint256 leftOverNotMatchedWithETH = totalTokensForUni.sub(amtDesiredToken);

        batches.push(Batch(treasury, unsoldTokens.add(leftOverNotMatchedWithETH), block.timestamp + oneWeekSeconds, false));
        emit BatchLocked(treasury, unsoldTokens.add(leftOverNotMatchedWithETH), block.timestamp + oneWeekSeconds);
        ended = true;
    }

    function claimLiquidity() public onlyOwner{

        (uint256 timeStamp, uint256 amtClaimable) = pol.getUserVestingAtIndex(uniswapPair, address(this),0);
        require(block.timestamp >= timeStamp, "Not claimable yet!");

        pol.withdrawToken(uniswapPair, amtClaimable);
        IUniswapV2Pair pair = IUniswapV2Pair(uniswapPair);
        uint amtLPheld = pair.balanceOf(address(this));
        pair.transfer(devAddress, amtLPheld);
    }   

    function claimToken(uint b) public onlyOwner {
        require(!batches[b].spent, "Already claimed");
        require(block.timestamp >= batches[b].time, "Not claimable yet!");

        IERC20 token = IERC20(tokenAdd);
        require(token.transfer(batches[b].owner, batches[b].amount));
        batches[b].spent = true;
    }

    function amtToken() public view returns (uint256){
        return IERC20(tokenAdd).balanceOf(address(this));
    }
    function uniswapPairAdd() public view returns (address) {
        return uniswapPair;
    }

    // function emergencyWithdraw() public onlyOwner {
    //     IERC20 tokenContract = IERC20(tokenAdd);
    //     uint256 bal = tokenContract.balanceOf(address(this));
    //     tokenContract.transfer(msg.sender, bal);
        
    //     uint256 balEth = address(this).balance;
    //     msg.sender.transfer(balEth);
    // }
  
}
