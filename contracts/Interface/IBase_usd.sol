// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;

interface IBase_usd {
    function mint(address account, uint amount) external;
    function burn(address account, uint amount) external;
    function totalSupply() external view returns(uint);
    function burnForSelf(uint amount) external;
}
