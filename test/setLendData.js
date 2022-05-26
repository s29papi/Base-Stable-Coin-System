const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("Base Lend contract data", function () {
  let BaseLend;
  let tankconfig;
  it(" Base Lend setTokens", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseLend");

            BaseLend = await contract.connect(deployerWallet).attach("0x48860E160F05b09aEf140887CfB53A3Fce95f956");

            let baseusd = "0xbBd32C5F1aF05a6f0AE433113E59550EC9dc93a6";

            // let basecore = "0x513EA732Ca73b3d09C62d85e00521E308598BF25";
            //
            // let BasecollDeployer = "0xb5D7454693156024d1012fc46AA177859087caAE";
            //
            // let setTokens =  await BaseLend.setTokens(baseusd, basecore, BasecollDeployer);
            //
            // console.log(setTokens);
            //
            // let priceoracle = "0x11F157B709aE0202e488EB89D031812248d9bb8A";
            // let setOracle = await BaseLend.setPriceOracle(priceoracle);
            // console.log(setOracle);

            // const status = ethers.BigNumber.from("1");
            // await BaseLend.setIBTStatus(baseusd, status);
            // let WETH = "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616";
            // let WBTC = "0x9099c8C94c198986D5bf98Fb8132Faa873089374";
            //  await BaseLend.setNIBTStatus(WETH,status);
            //  await BaseLend.setNIBTStatus(WBTC,status);




  })

})
