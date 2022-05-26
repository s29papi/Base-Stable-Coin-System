require('dotenv').config();
const hre = require("hardhat");

async function main() {
                        const provider = hre.ethers.provider;
                        const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

                        console.log(
                            "Deploying contracts with the account:",
                            deployerWallet.address
                        );

                        console.log(
                            "Account balance:",
                            (await deployerWallet.getBalance()).toString()
                        );

                         // deploy backing tokens
                        let backingtokens = ["DAI", "FRAX", "USDC", "USDT", "UST"];

                        let Tokens = new Array();

                        let deployedTokens = new Array();
                        // deployed dummy tokens on aurora testnet for illustration
                        // DAI: 0xA4dE8c23db1925fB97c55ce18427F03a114e1405
                        // FRAX: 0xfF1aBbE83F8E4936c0e958C8e3e3Fbc74C24cB03
                        // USDC: 0x9c47048ee766B453368297239d065f9685D0C80e
                        // USDT: 0x283cFe2b92bfe7d5Ae6f83aF74e96D3e64F25b62
                        // UST: 0xF07d15C6b10739EBb342854A157947241e6399B0

                        for ( let       start = 0;      start     <     backingtokens.length;     start++    )        {
                              Tokens[start] = await hre.ethers.getContractFactory(backingtokens[start]);
                              deployedTokens[start] = await Tokens[start].connect(deployerWallet).deploy();
                              await deployedTokens[start].deployed();
                              console.log(`${backingtokens[start]}: ${deployedTokens[start].address}`);
                        }



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
