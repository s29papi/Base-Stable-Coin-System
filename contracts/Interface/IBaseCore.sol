// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;


interface IBaseCore {
    function mint(uint dusdAmount, address account) external returns(uint usd);
    function redeem(uint dusdAmount, address account) external returns(uint usd);
    function harvest() external;
    function earned() external view returns(uint);
    function dusdToUsd(uint _dusd, bool fee) external view returns(uint usd);
    function peaks(address peak) external view returns (uint,uint,uint8);
}
