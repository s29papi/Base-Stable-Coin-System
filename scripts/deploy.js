const {  ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let tokens = ["DAI", "FRAX", "USDC", "USDT", "UST"];

  let Tokens = new Array();

  let deployedTokens = new Array();

  for ( let       start = 0;      start     <      tokens.length;     start++    )        {
        Tokens[start] = await ethers.getContractFactory(tokens[start]);
        deployedTokens[start] = await Tokens[start].deploy();
        await deployedTokens[start].deployed();
        console.log(`${tokens[start]}: ${deployedTokens[start].address}`);
  } // To Run Script: npx hardhat run scripts/deployDummyTokens.js --network rinkeby
            // DAI: 0xDf690EC094306E63a8816825A159b239111fB18d
            // FRAX: 0xF5c32A164c323cB8563B0d746587aEFA1f101684
            // USDC: 0x486B31317D6da738eaD3116A7167165C63D9709A
            // USDT: 0x3a75aCbB1b1EF50C176cE06f672eeb825A9a3023
            // UST: 0x9587d77cf39BE8aeEe426A755760A7F37EEd934A
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });










     // let hardhatcontracts;



    // const mockstables = ["0x7062A08c24B48fa2f21D9d7afc5e484FcC80E397", "0x6b8663F13E7649F7C6e3Eae9EE72A9C088D8A140", "0x57B538e311f90bC7d97CDb1b291a1C40944A309D", "0x956b436a46519bA90ef55c9458faffe0C359Ed1D"  ];
    //
    // contracts = await ethers.getContractFactory("BaseCore");
    //
    // hardhatcontracts = await upgrades.deployProxy(contracts, [mockstables], {
    //   initializer: "initialize(address[4])",
    // });
    // await hardhatcontracts.deployed();


    //
    // for (let i = 0; i < namesOfContract.length; i++) {
    //   contracts[i] = await ethers.getContractFactory(namesOfContract[i]);
    //   if (i < 1) {
    //     hardhatcontracts[i] = await contracts[i].deploy();
    //     await hardhatcontracts[i].deployed();
    //   } else {
    //     hardhatcontracts[i] = await upgrades.deployProxy(contracts[i], [mockstables], {
    //       initializer: "initialize(address[4])",
    //     });
    //     await hardhatcontracts[i].deployed();
    //   }
    // }

    // console.log(`Vault contract: ${hardhatcontracts[0].address}`);
    // console.log(`BaseCore contract: ${hardhatcontracts.address}`);
