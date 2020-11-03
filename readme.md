create a .env file with the following:

INFURA_API_KEY=\<fill this in\>

MAINNET_KEY=\<private key of deployer acc\>

TREASURY_ADD=<treasury wallet>
UNICRYPT_ADD=0x17e00383A843A9922bCA3B280C0ADE9f8BA48449
UNISWAP_ROUTER_ADD=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
UNISWAP_FACTORY_ADD=0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f

TMELOCKER_ADD=<fill in after deploying TMElocker>

Steps:
1. truffle migrate --reset --network <mainnet|mainnet-fork|ropsten>
2. run truffle exec script.js --network <mainnet|mainnet-fork|ropsten> to begin crowdsale and contrib 1 eth as test
3. run truffle exec end.js --network <mainnet|mainnet-fork|ropsten> to end the crowdsale, claim unsold tokens to treasury, lock liquidity