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

                           // deploy interest bearing tokens
                           let NIBT = ["WBTC", "WETH", "BasecollDeployer"];

                           let contract = new Array();
                           let deployedContract = new Array();

                          // WBTC: 0x9099c8C94c198986D5bf98Fb8132Faa873089374
                          // WETH: 0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616
                          // BasecollDeployer: 0xb5D7454693156024d1012fc46AA177859087caAE



                           for ( let start = 0; start < NIBT.length; start++ ) {
                              contract[start] = await hre.ethers.getContractFactory(NIBT[start]);
                              deployedContract[start] =  await contract[start].connect(deployerWallet).deploy();
                              console.log(`${NIBT[start]}: ${deployedContract[start].address}`);
                           }


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
