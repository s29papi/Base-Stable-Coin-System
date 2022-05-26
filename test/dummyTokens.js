const { expect } = require("chai");


// Test: --------------------->>>>     {FRAX, DAI, USDT, UST, USDC}      <<<<-------------------- //
describe("Dummy Tokens contract", function () {


        let owner;


        it("should test minting functionality of all dummy tokens", async function () {
                    [owner] = await ethers.getSigners();

                    console.log("signer address:", owner.address);

                    console.log("signer balance:", (await owner.getBalance()).toString());

                    let tokens = ["DAI", "FRAX", "USDC", "USDT", "UST"];

                    let address = ["0xc6B18b7628a93ADbead1DE5a3380abe83195488d", "0x03e485c8fB04d20aEA5921a9cbBDBbfce6FA063E", "0x18FBa389eb31F8376B0c249E6e253A1C0BdAF81e", "0x516C56DBDa98B562A63098EfC0f20a0E73e8bEc9", "0x9380DB31222F5ae000e9Cb1872564dA82F5a54E4"];

                    let Tokens = new Array();

                    let deployedTokens = new Array();

                    const amount = ethers.BigNumber.from("9");
                    const multiplier = ethers.BigNumber.from(`${10**18}`);
                    const mintAmount = amount.mul(multiplier);

                    for ( let       start = 0;      start     <      tokens.length;     start++    )        {
                          Tokens[start] = await ethers.getContractFactory(tokens[start]);
                          deployedTokens[start] = await Tokens[start].attach(address[start]);
                          let mint  =   await      deployedTokens[start].mint(mintAmount);
                          console.log(mint);
                    }
        });
});
