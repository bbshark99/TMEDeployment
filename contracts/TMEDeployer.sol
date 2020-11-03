pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./TME.sol";
import "./TMECrowdsale.sol";
import "./TMELocker.sol";

contract TMEDeployer is Ownable{



    address payable public tmeLockerAdd;
    address public crowdsaleAdd;
    address public tokenAdd;
    address payable public treasury;


    constructor(address _router, address _factory, address _pol,
        address payable _dev,
        address payable _treasury) 
        public
    {
        treasury = _treasury;

        // create a 1000 tokens
        IERC20 token = new TME(1000000000000000000000);
        tokenAdd = address(token);
        
        // crowdsale contract
        TMECrowdsale crowdsale = new TMECrowdsale(
            3,               
            1 ether,
            60 ether,
            tokenAdd
        );
        crowdsaleAdd = address(crowdsale);

        // // lock contract
        TMELocker locker = new TMELocker(
            _router, _factory, _pol, _dev, _treasury, tokenAdd
        );
        tmeLockerAdd = address(locker);
        crowdsale.setTMELocker(tmeLockerAdd);


        // send crowdsale contract 180 tokens to sell
        token.transfer(address(crowdsale), 180000000000000000000);

        // 820 to locker
        token.transfer(tmeLockerAdd, 820000000000000000000);

        require(token.balanceOf(address(this)) == 0, "still got tokens left!");

        // transfer ownership
       crowdsale.transferOwnership(_dev);
       locker.transferOwnership(_dev);

    }
}