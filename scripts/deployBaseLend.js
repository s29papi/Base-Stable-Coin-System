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


                        let contract = await hre.ethers.getContractFactory("BaseLend");
                        let deployedContract = await contract.connect(deployerWallet).deploy();


                        // Base Lend Address: 0x48860E160F05b09aEf140887CfB53A3Fce95f956 
                        console.log(`Base Lend Address: ${deployedContract.address}`);




}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
