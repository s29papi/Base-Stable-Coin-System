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
                           let IBT = ["BaseStables", "Base_usd"];

                           let contract = new Array();
                           let deployedContract = new Array();

                           // BaseStables: 0x1b4e61E6C68ea3f78FA23350dFD433451d57ef0B
                           // Base_usd: 0xbBd32C5F1aF05a6f0AE433113E59550EC9dc93a6

                           for ( let start = 0; start < IBT.length; start++ ) {
                              contract[start] = await hre.ethers.getContractFactory(IBT[start]);
                              deployedContract[start] =  await contract[start].connect(deployerWallet).deploy("0x513EA732Ca73b3d09C62d85e00521E308598BF25");
                              console.log(`${IBT[start]}: ${deployedContract[start].address}`);
                           }


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
