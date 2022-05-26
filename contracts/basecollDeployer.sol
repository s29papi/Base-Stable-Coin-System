// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BaseCore.sol";
import "./basecoll.sol";

contract BasecollDeployer {

        function createNewbasecoll(
                    string memory _name,
                    string memory _symbol,
                    ERC20 _underlyingAsset
        ) public returns (basecoll) {
                    basecoll BaseColl = new basecoll(_name, _symbol, BaseCore(msg.sender), _underlyingAsset);
                    return BaseColl;
        }

}
