const { expect } = require("chai");
require('dotenv').config();
const hre = require("hardhat");

describe("get Base Lend contract Data", function () {
  let BaseLend;
  let tankconfig;
  it("should get Base Lend data", async function () {

            const provider = hre.ethers.provider;

            const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);

            const contract = await hre.ethers.getContractFactory("BaseLend");

            BaseLend = await contract.connect(deployerWallet).attach("0x48860E160F05b09aEf140887CfB53A3Fce95f956");

            let baseusd = "0xbBd32C5F1aF05a6f0AE433113E59550EC9dc93a6";

            tankconfig = "0xD7715a452e6dc692fE5Dd0bfd2954C8c933F5f99";

            const getIBTData = await BaseLend.getIBTdata();

            console.log(getIBTData);

           let WBTC = "0x9099c8C94c198986D5bf98Fb8132Faa873089374";
           let WETH = "0xF75aFf08eF8Bc07Ced5D82AEf585e1398195D616";

           let getNIBT2data = await BaseLend.getNIBTdata(WBTC);

           const getNIBTdata = await BaseLend.getNIBTdata(WETH);

           console.log(getNIBT2data);

           console.log(getNIBTdata);





  })

})
