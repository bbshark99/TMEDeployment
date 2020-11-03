pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TME is ERC20 {
    constructor(uint256 initialSupply) 
    ERC20("TAMA EGG NiftyGotchi", "TME") public {
        _mint(msg.sender, initialSupply);
    }
}