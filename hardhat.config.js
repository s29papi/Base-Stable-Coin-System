require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config()
  

 module.exports = {
   solidity: {
     compilers: [
       {
         version: "0.8.4",
       },
       {
         version: "0.8.1",
         settings: {

         },
       },
     ],
   },
   networks: {
     testnet_aurora: {
       url: 'https://testnet.aurora.dev',
       accounts: [process.env.AURORA_PRIVATE_KEY],
       chainId: 1313161555,
       gasPrice: 120 * 1000000000
     }
   },
   mocha: {
     timeout: 40000000
   }
 };
