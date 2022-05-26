const { expect } = require("chai");

describe("Basecore contract", function () {
          let deployed;
          let basecollDeployer;
          let baseTokens;
          let poolConfig;
          let noninterestbearingtanktokens;
          let deployedTokens;
          let deployer;

          it("Init contract", async function () {
             [deployer] = await ethers.getSigners();

            console.log("Deploying contracts with the account: ", deployer.address);

            console.log("Account balance:", (await deployer.getBalance()).toString());

            let tokens = ["DAI", "FRAX", "USDC", "USDT", "UST"];

            let Tokens = new Array();

            deployedTokens = new Array();

            const amount = ethers.BigNumber.from("1000");
            const multiplier = ethers.BigNumber.from(`${10**18}`);
            const mintAmount = amount.mul(multiplier);

            for ( let       start = 0;      start     <      tokens.length;     start++    )        {
                  Tokens[start] = await ethers.getContractFactory(tokens[start]);
                  deployedTokens[start] = await Tokens[start].deploy();
                  await deployedTokens[start].deployed();
                  console.log(`${tokens[start]}: ${deployedTokens[start].address}`);
                  await deployedTokens[start].mint(mintAmount);

            }

            let core = ["BaseCore", "BasecollDeployer"];

            let contract = await ethers.getContractFactory(core[1]);

            basecollDeployer = await contract.deploy();

            await basecollDeployer.deployed();

            console.log(`${core[1]}: ${basecollDeployer.address}`);



            contract = await ethers.getContractFactory(core[0]);

            let dummytokens = [deployedTokens[0].address, deployedTokens[1].address, deployedTokens[2].address, deployedTokens[3].address, deployedTokens[4].address];


            deployed = await upgrades.deployProxy(contract, [dummytokens], {
               initializer: "initialize(address[5])",
               unsafeAllow: ['delegatecall'],
             });

            await deployed.deployed();

            console.log(deployed.address);
          });

          it("Deploy Baseusd and Basestables", async function () {
            let tokens = ["BaseStables","Base_usd"];
            let Tokens = new Array();
            baseTokens = new Array();
            for ( let       start = 0;      start     <      tokens.length;     start++    )        {
                  Tokens[start] = await ethers.getContractFactory(tokens[start]);
                  baseTokens[start] = await upgrades.deployProxy(Tokens[start], [deployed.address], {
                     initializer: "initialize(address)",
                     unsafeAllow: ['delegatecall'],
                   });
                  await baseTokens[start].deployed();
                  console.log(`${tokens[start]}: ${baseTokens[start].address}`);
            }
           });

         it("setTokens Baseusd, Basestables, and BasecollDeployer", async function () {
            await deployed.setTokens(baseTokens[1].address, baseTokens[0].address, basecollDeployer.address);

          });

          it("Deploy IPoolConfiguration", async function () {
                      let contract = await ethers.getContractFactory("DefaultPoolConfiguration");
                      let baseBorrowRate = ethers.BigNumber.from("1");
                      baseBorrowRate = baseBorrowRate.mul(`${10**17}`);


                      let rateSlope1 = ethers.BigNumber.from("2");
                      rateSlope1 = rateSlope1.mul(`${10**17}`);

                      let rateSlope2 = ethers.BigNumber.from("4");
                      rateSlope2 = rateSlope2.mul(`${10**17}`);

                      let collateralPercent = ethers.BigNumber.from("75");
                      collateralPercent = collateralPercent.mul(`${10**16}`);

                      let liquidationBonusPercent = ethers.BigNumber.from("105");
                      liquidationBonusPercent = liquidationBonusPercent.mul(`${10**16}`);

                      poolConfig = await contract.deploy(baseBorrowRate, rateSlope1, rateSlope2, collateralPercent, liquidationBonusPercent);
                      await poolConfig.deployed();
                      console.log(poolConfig.address);
           });

           it("initializes interest bearing tokens", async function () {
                      let initIBT = await deployed.initIBT(baseTokens[1].address, poolConfig.address);
                      // let wait = await initIBT.wait()
                      // console.log(wait);
           });

           it("Deploy noninterestbearingtank", async function () {
                  let tokens = ["WETH", "WNEAR", "WBTC"];

                  let Tokens = new Array();

                  noninterestbearingtanktokens = new Array();

                  const amount = ethers.BigNumber.from("8");
                  const multiplier = ethers.BigNumber.from(`${10**18}`);
                  const mintAmount = amount.mul(multiplier);

                  for ( let       start = 0;      start     <      tokens.length;     start++    )        {
                        Tokens[start] = await ethers.getContractFactory(tokens[start]);
                        noninterestbearingtanktokens[start] = await Tokens[start].deploy();
                        await noninterestbearingtanktokens[start].deployed();
                        console.log(`${tokens[start]}: ${noninterestbearingtanktokens[start].address}`);
                        // mint non interest bearing token to self
                        let mint = await noninterestbearingtanktokens[start].mint(mintAmount);
                  }
                  let ownersCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployer.address);
                  console.log(`ownersCurrentBalance: ${ownersCurrentBalance}`);
                  let contractsCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployed.address);
                  console.log(`contractsCurrentBalance: ${contractsCurrentBalance}`);
           });

           it("initializes non interest bearing tokens", async function () {
                      let initNIBT = await deployed.initNIBT(noninterestbearingtanktokens[0].address, poolConfig.address);
                      // let wait = await initNIBT.wait()
                      // console.log(wait);
           });

           it("test the initialized recently interestbearingtanklist", async function () {
                      let interestbearingtanklist = await deployed.interestbearingtanklist(0);
                      console.log(interestbearingtanklist);
           });

           it("test the initialized recently noninterestbearingtanklist", async function () {
                      let noninterestbearingtanklist = await deployed.noninterestbearingtanklist(0);
                      expect(noninterestbearingtanklist).to.equal(noninterestbearingtanktokens[0].address);
           });

           it("test basecollDeployer is equal to the one deployed", async function () {
                      let address = await deployed.basecollDeployer();
                      console.log(`basecollDeployer: ${address}`);
           });

           it("gets the IBT data, testing to see if the values are as initialized", async function () {
                       let IBTdata = await deployed.getIBTdata();
                       // console.log(IBTdata);
           });

           it("gets the NIBT data, testing to see if the values are as initialized", async function () {
                       let NIBTdata = await deployed.getNIBTdata(noninterestbearingtanktokens[0].address);
                       // console.log(NIBTdata);
           });

           it("gets the NIBT data, testing to see if the values are as initialized", async function () {
                       let NIBTdata = await deployed.getNIBTdata(noninterestbearingtanktokens[0].address);
                       // console.log(NIBTdata);
           });

           it("should set the status of the Tanks to active", async function () {
                       const status = ethers.BigNumber.from("1");
                       let setIBTStatus = await deployed.setIBTStatus(baseTokens[1].address, status);
                       // console.log(setIBTStatus);
                       let setNIBTStatus = await deployed.setNIBTStatus(noninterestbearingtanktokens[0].address, status);
                       // console.log(setNIBTStatus);
           });

           it("deposits collateral, if its nibt tank has been initialized", async function () {
                       const amount = ethers.BigNumber.from("8");
                       const multiplier = ethers.BigNumber.from(`${10**18}`);
                       const depositAmount = amount.mul(multiplier);
                       await noninterestbearingtanktokens[0].approve(deployed.address, depositAmount);
                       let depositColl = await deployed.depositColl(noninterestbearingtanktokens[0].address, depositAmount);
                       let ownersCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployer.address);
                       console.log(`ownersCurrentBalance: ${ownersCurrentBalance}`);
                       let contractsCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployed.address);
                       console.log(`contractsCurrentBalance: ${contractsCurrentBalance}`);
                       // let wait = await depositColl.wait();
                       // console.log(wait);
           });

           it("withdraws collateral, if its nibt tank has been initialized", async function () {
                       const amount = ethers.BigNumber.from("8");
                       const multiplier = ethers.BigNumber.from(`${10**18}`);
                       const withdrawAmount = amount.mul(multiplier);
                       await noninterestbearingtanktokens[0].approve(deployed.address, withdrawAmount);
                       let depositColl = await deployed.withdrawColl(noninterestbearingtanktokens[0].address, withdrawAmount);
                       let ownersCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployer.address);
                       console.log(`ownersCurrentBalance: ${ownersCurrentBalance}`);
                       let contractsCurrentBalance =  await noninterestbearingtanktokens[0].balanceOf(deployed.address);
                       console.log(`contractsCurrentBalance: ${contractsCurrentBalance}`);
                       // console.log(wait);
           });

           it("mints baseusd in the base contract and recieves base stables which are interest bearing", async function () {
                       let amount = ethers.BigNumber.from("1000");
                       let multiplier = ethers.BigNumber.from(`${10**18}`);
                       const approveAmount = amount.mul(multiplier);
                       for (let start = 0; start < 5; start++) {
                         await  deployedTokens[start].approve(deployed.address, approveAmount);
                       }
                       amount = ethers.BigNumber.from("100");
                       multiplier = ethers.BigNumber.from(`${10**18}`);
                       const mintAmount = amount.mul(multiplier);
                       for ( let start = 0; start < 8; start++ ){
                         let mint = await deployed.mint(mintAmount);
                         let baseStableBalance = await baseTokens[0].balanceOf(deployer.address);
                         let baseusdBalance = await baseTokens[1].balanceOf(deployed.address);
                         // console.log(`mint number ${start}: ${baseStableBalance}`);
                         // console.log(`baseusd number ${start}: ${baseusdBalance}`);
                       }
           });

           it("burns baseusd in the base contract and recieves base stables which are interest bearing", async function () {
              // commented so that I would be able to test the borrow functionality
                       // amount = ethers.BigNumber.from("100");
                       // multiplier = ethers.BigNumber.from(`${10**18}`);
                       // const burnAmount = amount.mul(multiplier);
                       // for ( let start = 0; start < 8; start++ ){
                       //   let burn = await deployed.burn(burnAmount);
                       //   let baseStableBalance = await baseTokens[0].balanceOf(deployer.address);
                       //   let baseusdBalance = await baseTokens[1].balanceOf(deployed.address);
                       //   console.log(`burn basestables number ${start}: ${baseStableBalance}`);
                       //   console.log(`burn baseusd number ${start}: ${baseusdBalance}`);
                       // }
                       // for (let start = 0; start < 5; start++) {
                       //   let backingtokens = await  deployedTokens[start].balanceOf(deployer.address);
                       //   console.log(`owners tokens balance ${start}: ${backingtokens}`);
                       // }


           });

           it("borrows baseusd without checking account health, but monitors the tanks data", async function () {

                       amount = ethers.BigNumber.from("50");
                       multiplier = ethers.BigNumber.from(`${10**18}`);
                       const borrowAmount = amount.mul(multiplier);
                       let baseusdBalance = await baseTokens[1].balanceOf(deployed.address);
                       console.log(`initial baseusd number: ${baseusdBalance}`);

                       for ( let start = 0; start < 8; start++ ){
                         let borrow = await deployed.borrowBaseusd(borrowAmount);
                         // base stables should not change
                         let baseStableBalance = await baseTokens[0].balanceOf(deployer.address);
                         // whereas base usd should decrease
                         baseusdBalance = await baseTokens[1].balanceOf(deployed.address);
                         console.log(`basestables number ${start}: ${baseStableBalance}`);
                         console.log(`remaining baseusd number ${start}: ${baseusdBalance}`);
                       }
                       for (let start = 0; start < 5; start++) {
                         // check if owner backing tokens increased
                         let backingtokens = await  deployedTokens[start].balanceOf(deployer.address);
                         console.log(`owners backing tokens balance ${start}: ${backingtokens}`);
                         // check if base stables equals backing tokens
                         backingtokens = await  deployedTokens[start].balanceOf(deployed.address);
                         console.log(`contract backing tokens balance ${start}: ${backingtokens}`);
                       }

                       let IBTdata = await deployed.getIBTdata();
                       console.log(IBTdata);


           });


});
