// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./BaseCore.sol";

contract basecoll is ERC20  {
          using SafeMath for uint256;

           BaseCore private basecore;

           ERC20 public underlyingAsset;



           constructor(string memory _name, string memory _symbol, BaseCore _BaseCoreAddress, ERC20 _underlyingAsset) ERC20(_name, _symbol) {
                        basecore = _BaseCoreAddress;
                        underlyingAsset = _underlyingAsset;
           }

           function mint(address _account, uint256 _amount) external  {
                    _mint(_account, _amount);
          }

          function burn(address _account, uint256 _amount) external  {

                    _burn(_account, _amount);
          }


          function _transfer(
            address _from,
            address _to,
            uint256 _amount
          ) internal override {
            super._transfer(_from, _to, _amount);
            // require(basecore.isAccountHealthy(_from), "Transfer tokens is not allowed");
          }




}
