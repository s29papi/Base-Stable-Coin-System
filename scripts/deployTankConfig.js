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
                        let backingtokens = ["0xA4dE8c23db1925fB97c55ce18427F03a114e1405", "0xfF1aBbE83F8E4936c0e958C8e3e3Fbc74C24cB03", "0x9c47048ee766B453368297239d065f9685D0C80e", "0x283cFe2b92bfe7d5Ae6f83aF74e96D3e64F25b62", "0xF07d15C6b10739EBb342854A157947241e6399B0"];

                        let contract = await hre.ethers.getContractFactory("DefaultPoolConfiguration");

                        let baseBorrowRate = hre.ethers.BigNumber.from("1");
                        baseBorrowRate = baseBorrowRate.mul(`${10**17}`);


                        let rateSlope1 = hre.ethers.BigNumber.from("2");
                        rateSlope1 = rateSlope1.mul(`${10**17}`);

                        let rateSlope2 = hre.ethers.BigNumber.from("4");
                        rateSlope2 = rateSlope2.mul(`${10**17}`);

                        let collateralPercent = hre.ethers.BigNumber.from("75");
                        collateralPercent = collateralPercent.mul(`${10**16}`);

                        let liquidationBonusPercent = hre.ethers.BigNumber.from("105");
                        liquidationBonusPercent = liquidationBonusPercent.mul(`${10**16}`);

                        let deployedContract = await contract.connect(deployerWallet).deploy(baseBorrowRate, rateSlope1, rateSlope2, collateralPercent, liquidationBonusPercent);
                        // Tank config Address: 0xD7715a452e6dc692fE5Dd0bfd2954C8c933F5f99
                        console.log(`Tank config Address: ${deployedContract.address}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
