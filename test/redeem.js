const { expect } = require("chai");


// Test: --------------------->>>>     {FRAX, DAI, USDT, UST, USDC}      <<<<-------------------- //
describe("Base Core contract", function () {


        let owner;


        it("should test redeem functionality of all dummy tokens", async function () {
                    [owner] = await ethers.getSigners();

                    console.log("signer address:", owner.address);

                    console.log("signer balance:", (await owner.getBalance()).toString());

                    let core = ["BaseCore", "DAI", "FRAX", "USDC", "USDT", "UST"];
                    
                    let address = ["0x209B8c47F15847441E78a8C52F37e38D570C1E71", "0xc6B18b7628a93ADbead1DE5a3380abe83195488d", "0x03e485c8fB04d20aEA5921a9cbBDBbfce6FA063E", "0x18FBa389eb31F8376B0c249E6e253A1C0BdAF81e", "0x516C56DBDa98B562A63098EfC0f20a0E73e8bEc9", "0x9380DB31222F5ae000e9Cb1872564dA82F5a54E4"];

                    let addressBaseusd = ["0x220A8E86895025917d9a2cB3F820176C4473337C"];

                    let addressBasestable = ["0xdeF7161a2eCaD593316D18aD7a50Ee018636D3d4"];

                    let contract = new Array();

                    const amount = ethers.BigNumber.from("9");
                    const multiplier = ethers.BigNumber.from(`${10**18}`);
                    const mintAmount = amount.mul(multiplier);


                    let instance = await ethers.getContractFactory(core[0]);
                    contract[0] = await instance.attach(address[0]);

                    let burn = await contract[0].burn(mintAmount);
                    console.log(burn);








        });
});
