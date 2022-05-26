const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("BaseLend Contract", function () {
  let BaseLend
 let tankconfig;
  it("Borrow Baseusd", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseLend");

            const amount = ethers.BigNumber.from("200"); // 10 i need 18
            const multiplier = ethers.BigNumber.from(`${10**18}`);
            const borrowAmount = amount.mul(multiplier);

            BaseLend = await contract.connect(deployerWallet).attach("0x48860E160F05b09aEf140887CfB53A3Fce95f956");

          // let cc =  await BaseCore.getUserTankData(deployerWallet.address, "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616");
          // //
          //  console.log(cc);

           let cc =  await BaseLend.borrowBaseusd(borrowAmount);
           //
            console.log(cc);
  })

})
