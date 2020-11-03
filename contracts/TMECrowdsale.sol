pragma solidity ^0.6.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./TMELocker.sol";

// import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
// import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
// import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
// import "@openzeppelin/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";


contract TMECrowdsale is Ownable {
    using SafeMath for uint256;

    uint256 public raised;
    mapping (address => uint256) public contributions;

    uint256 rate;
    uint256 indivCap;
    uint256 cap;
    address tokenAdd;
    address payable tokenLockerAdd;
    bool public started;

    constructor(
        uint256 _rate,
        uint256 _indivCap,
        uint256 _cap,
        address _tokenAdd
    )
        public
    {
        rate = _rate;
        indivCap = _indivCap;
        cap = _cap;
        tokenAdd = _tokenAdd;
    }   
    function setTMELocker(address payable _tokenLocker) external onlyOwner{
        tokenLockerAdd = _tokenLocker;
    }

    receive () external payable {
        buyTokens();
    }
    function setStarted(bool s) external onlyOwner{
        started = s;
    }
    function buyTokens() public payable{
        require(started, "Presale not started!");
        require(tokenLockerAdd != address(0), "tokenLockerAdd not set!");

        uint256 amtEth = msg.value;
        uint256 amtBought = contributions[msg.sender];
        require(amtBought.add(amtEth) <= indivCap, "Exceeded individual cap");
        require(raised < cap, "Raise limit has reached");

        if (amtEth.add(raised) >= cap){
            uint256 amtEthToSpend = amtEth.add(raised).sub(cap);
            uint256 amtTokenToReceive = amtEthToSpend.mul(rate);
            require(amtTokenToReceive <= amtTokenLeft(), "Ran out of tokens");
            contributions[msg.sender] = contributions[msg.sender].add(amtEthToSpend);
            raised = raised.add(amtEthToSpend);
            IERC20(tokenAdd).transfer(msg.sender, amtTokenToReceive);
            msg.sender.transfer(amtEth.sub(amtEthToSpend));
            TMELocker(tokenLockerAdd).receiveFunds{value:amtEth.sub(amtEthToSpend)}();
        } else {
            uint256 amtTokenToReceive2 = amtEth.mul(rate);
            require(amtTokenToReceive2 <= amtTokenLeft(), "Ran out of tokens");
            contributions[msg.sender] = contributions[msg.sender].add(amtEth);
            raised = raised.add(amtEth);
            IERC20(tokenAdd).transfer(msg.sender, amtTokenToReceive2);
            TMELocker(tokenLockerAdd).receiveFunds{value: amtEth}();
        }
    }

    function amtTokenLeft() public view returns (uint256) {
        IERC20 token = IERC20(tokenAdd);
        uint256 bal = token.balanceOf(address(this));
        return bal;
    }
    
    function claimUnsoldTokens() public onlyOwner {
        IERC20 token = IERC20(tokenAdd);
        uint256 bal = token.balanceOf(address(this));
        token.transfer(tokenLockerAdd, bal);
    }


}