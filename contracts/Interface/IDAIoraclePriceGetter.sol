// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IDAIoraclePriceGetter {
        function getPrice (string memory usdpair) external view returns (uint128 Price, uint128 TimeStamp);
}
