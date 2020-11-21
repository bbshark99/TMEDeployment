pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./IUnicrypt.sol";

contract TMETimeLock is Ownable {
    using SafeMath for uint256;

    struct Batch {
        address owner;
        uint256 amount;
        uint256 time;
        bool spent;
    }
    
    Batch[] public batches;

    address public tokenAdd;

    event BatchLocked(address owner, uint256 amtLocked, uint256 releaseTime);

    constructor(address _token) public{
        tokenAdd = _token;
    }
    function numBatches() public view returns (uint256){
        return batches.length;
    }
    function lock(uint256 amtLocked, uint256 releaseTime) public{
        IERC20 t = IERC20(tokenAdd);
        uint256 bal1 = t.balanceOf(address(this));
        t.transferFrom(msg.sender, address(this), amtLocked);
        uint256 bal2 = t.balanceOf(address(this));
        require(bal2.sub(bal1) == amtLocked, "Transfer amt does not match balance in receiving contract");

        batches.push(Batch(msg.sender, amtLocked, releaseTime, false));
        emit BatchLocked(msg.sender, amtLocked, releaseTime);
    }
    function setTokenAdd(address t) onlyOwner public{
        tokenAdd = t;
    }
    
    function claimToken(uint b) public {
        require(b < batches.length, "Invalid index");
        require(!batches[b].spent, "Already claimed");
        require(block.timestamp >= batches[b].time, "Not claimable yet!");

        IERC20 token = IERC20(tokenAdd);
        require(token.transfer(batches[b].owner, batches[b].amount));
        batches[b].spent = true;
    }  
}
