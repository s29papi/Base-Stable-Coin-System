// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Dummy contract implementing USDT token

contract USDT   is         ERC20                   {

        constructor ()               ERC20("U.S Dollar Tether", "USDT")            {

        }

        function mint(uint256 amount)  public {     _mint(msg.sender, amount);     }
}
