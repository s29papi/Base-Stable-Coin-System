const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("Base Contract", function () {
  let BaseCore;

  it("set status and price oracle", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseCore");

            BaseCore = await contract.connect(deployerWallet).attach("0xe8BB8151776a923848d55DaaB3C27Aeb42D4b782");

            let priceoracle = "0x11F157B709aE0202e488EB89D031812248d9bb8A";
            await BaseCore.setPriceOracle(priceoracle);

            let baseusd = "0xc66A89DC046315984fAf333C14D054e63A2B94BF";

            const status = ethers.BigNumber.from("1");
            // await BaseCore.setIBTStatus(baseusd, status);
            let WETH = "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616";
            let WBTC = "0x9099c8C94c198986D5bf98Fb8132Faa873089374";
            // await BaseCore.setNIBTStatus(WETH,status);
            // await BaseCore.setNIBTStatus(WBTC,status);


  })

})
