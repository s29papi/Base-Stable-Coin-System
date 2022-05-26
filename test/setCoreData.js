const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("Init Base Contract", function () {
  let BaseCore;
  let tankconfig;
  it(" Base Core setTokens", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseCore");

            BaseCore = await contract.connect(deployerWallet).attach("0x513EA732Ca73b3d09C62d85e00521E308598BF25");

            let baseusd = "0xbBd32C5F1aF05a6f0AE433113E59550EC9dc93a6";

            let basestables = "0x1b4e61E6C68ea3f78FA23350dFD433451d57ef0B";

            let baselend = "0x48860E160F05b09aEf140887CfB53A3Fce95f956";

            let setTokens =  await BaseCore.setTokens(baseusd, basestables, baselend);

            console.log(setTokens);


  })

  it("Should init IBT and NIBT", async function () {

      // let baseusd = "0xc66A89DC046315984fAf333C14D054e63A2B94BF";
    // //
    // tankconfig = "0xD7715a452e6dc692fE5Dd0bfd2954C8c933F5f99";
    // // //
    // // const initIBT = await BaseCore.initIBT(baseusd, tankconfig);
    // // console.log(initIBT);
    // //
    // let WBTC = "0x9099c8C94c198986D5bf98Fb8132Faa873089374";
    //  // let WETH = "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616";
    //
    // await BaseCore.initNIBT(WBTC, tankconfig, "BTC/USD" );

     // await BaseCore.initNIBT(WETH, tankconfig, "ETH/USD" );

  })

  it("Should return latest price BTC", async function () {

    // const getPrice = await DAIoraclePriceGetter.getPrice("BTC/USD");
    // console.log(getPrice);

  })
})
