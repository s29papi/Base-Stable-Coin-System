const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("Init Base Contract", function () {
  let BaseCore;
  let tankconfig;
  it("setTokens", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseCore");

            BaseCore = await contract.connect(deployerWallet).attach("0xe8BB8151776a923848d55DaaB3C27Aeb42D4b782");


            // BaseStables: 0x3B846D7900f533C0c9713C859319ae8Fc04227db
            // Base_usd: 0xc66A89DC046315984fAf333C14D054e63A2B94BF

            let baseusd = "0xc66A89DC046315984fAf333C14D054e63A2B94BF";

            let basestables = "0x3B846D7900f533C0c9713C859319ae8Fc04227db";

            let BasecollDeployer = "0xb5D7454693156024d1012fc46AA177859087caAE";
          //
          // let cc =  await BaseCore.setTokens(baseusd, basestables, BasecollDeployer);
          // //
          // console.log(cc);


  })

  it("Should init IBT and NIBT", async function () {

      // let baseusd = "0xc66A89DC046315984fAf333C14D054e63A2B94BF";
    // //
    tankconfig = "0xD7715a452e6dc692fE5Dd0bfd2954C8c933F5f99";
    // //
    // const initIBT = await BaseCore.initIBT(baseusd, tankconfig);
    // console.log(initIBT);
    //
    let WBTC = "0x9099c8C94c198986D5bf98Fb8132Faa873089374";
     // let WETH = "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616";

    await BaseCore.initNIBT(WBTC, tankconfig, "BTC/USD" );

     // await BaseCore.initNIBT(WETH, tankconfig, "ETH/USD" );

  })

  it("Should return latest price BTC", async function () {

    // const getPrice = await DAIoraclePriceGetter.getPrice("BTC/USD");
    // console.log(getPrice);

  })
})
