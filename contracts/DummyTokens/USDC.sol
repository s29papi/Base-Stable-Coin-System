// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Dummy contract implementing USDC token

contract USDC      is                    ERC20      {

      constructor ()               ERC20("U.S Dollar Coin", "USDC")            {

      }

      function mint(uint256 amount)  public {     _mint(msg.sender, amount);     }
}
