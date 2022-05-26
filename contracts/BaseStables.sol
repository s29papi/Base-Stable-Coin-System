// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Base_usd keeps track of the Base_usd stable coin.
// By default erc20 uses 18 decimals so "1 usdB == 1 * 10^18"
// BaseCore contract has access as specified by the modifier to the contract.
contract BaseStables          is   ERC20           {
    address public basecore;
    /*Deploy baseusd first so that you can initialize this contract with its address*/
    constructor (address _basecore)      ERC20("Base Stable's", "BSS")                  {
                         basecore = _basecore;
    }

    modifier onlyCore () {
        require(msg.sender == basecore, "Not authorized");
        _;
    }

    function mint (address account, uint amount)  public  onlyCore    {  _mint(account, amount); }

    function burn (address account, uint amount)  public  onlyCore    {  _burn(account, amount); }

    function burnForSelf (uint amount)          external           { _burn(msg.sender, amount);  }
}
