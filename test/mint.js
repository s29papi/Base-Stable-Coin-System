const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe(" Base Contract", function () {
  let BaseLend;

  it("should get tanks data", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            let backingtokens = ["0xA4dE8c23db1925fB97c55ce18427F03a114e1405", "0xfF1aBbE83F8E4936c0e958C8e3e3Fbc74C24cB03", "0x9c47048ee766B453368297239d065f9685D0C80e", "0x283cFe2b92bfe7d5Ae6f83aF74e96D3e64F25b62", "0xF07d15C6b10739EBb342854A157947241e6399B0"];


            let collateraltokens = ["0x9099c8C94c198986D5bf98Fb8132Faa873089374", "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616"];

            let collateralNames = ["WBTC", "WETH"];


            let tokens = ["DAI", "FRAX", "USDC", "USDT", "UST"];

            let basecore = "0x513EA732Ca73b3d09C62d85e00521E308598BF25";
            let baselend = "0x48860E160F05b09aEf140887CfB53A3Fce95f956";


            let tokencontract = new Array();

            let tokencontracts = new Array();

            const amount = ethers.BigNumber.from("2000");
            const multiplier = ethers.BigNumber.from(`${10**18}`);
            const mintAmount = amount.mul(multiplier);

            // for (let start = 0; start < collateraltokens.length; start++ ) {
            //
            //    tokencontract[start] = await hre.ethers.getContractFactory(collateralNames[start]);
            //
            //    tokencontracts[start] = await tokencontract[start].connect(deployerWallet).attach(collateraltokens[start]);
            //           // let jj = await tokencontracts[start].balanceOf(basecore);
            //           // console.log(jj);
            //    // await tokencontracts[start].approve(basecore, mintAmount);
            //     await tokencontracts[start].mint(mintAmount);
            //
            //     await tokencontracts[start].approve(baselend, mintAmount);
            // }


               //  // manually approves basecore transaction
               // let hh = await hre.ethers.getContractFactory(collateralNames[1]);
               //
               // let cc = await hh.connect(deployerWallet).attach(collateraltokens[1]);
               //
               // await cc.approve("0x99EF7d4B679d96ECACc24323AEBA441512168dbF", mintAmount);


            //
            // for (let start = 0; start < backingtokens.length; start++ ) {
            //
            //    tokencontract[start] = await hre.ethers.getContractFactory(tokens[start]);
            //
            //    tokencontracts[start] = await tokencontract[start].connect(deployerWallet).attach(backingtokens[start]);
            //
            //
            //    await tokencontracts[start].mint(mintAmount);
            //
            //
            //     await tokencontracts[start].approve(basecore, mintAmount);
            //
            // }
            //
            const contractone = await hre.ethers.getContractFactory("BaseLend");

            BaseLend = await contractone.connect(deployerWallet).attach(baselend);

            const contracttwo = await hre.ethers.getContractFactory("BaseCore");

            BaseCore = await contracttwo.connect(deployerWallet).attach(basecore);

  });

    it ("Should mint WETH and WBTC", async function () {

                  // for (let start = 0; start < backingtokens.length; start++ ) {
                  //
                  //    tokencontract[start] = await hre.ethers.getContractFactory(tokens[start]);
                  //
                  //    tokencontracts[start] = await tokencontract[start].connect(deployerWallet).attach(backingtokens[start]);
                  //
                  //    await tokencontracts[start].approve(basecore, mintAmount);
                  //    // await tokencontracts[start].mint(mintAmount);
                  //
                  // }
    });

  it ("Should mint baseusd", async function () {

    // const amount = ethers.BigNumber.from("10000");
    // const multiplier = ethers.BigNumber.from(`${10**18}`);
    // const mintAmount = amount.mul(multiplier);
    //
    // await BaseCore.mint(mintAmount);
  });

  it ("Should deposit WETH and WBTC as collateral", async function () {


            const amount = ethers.BigNumber.from("1");
            const multiplier = ethers.BigNumber.from(`${10**18}`);
            const mintAmount = amount.mul(multiplier);
            let collateraltokens = ["0x9099c8C94c198986D5bf98Fb8132Faa873089374", "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616"];
            let baseusd = "0xbBd32C5F1aF05a6f0AE433113E59550EC9dc93a6";
          // let oo =  await BaseLend.depositColl("0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616", mintAmount);
          let oo =  await BaseLend.getUserAccount("0xC26eD63a8CbF6aB5daFB9A5976cFE1b6C0AfC5e3");
          // let wait = await oo.wait();
          console.log(oo);
    });


});
