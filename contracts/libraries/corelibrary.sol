// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../Interface/IPoolConfiguration.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../libraries/WadMath.sol";
import "../libraries/Math.sol";
import "../basecoll.sol";

import "../Interface/IBase_usd.sol";
import "../Interface/IBase_stables.sol";
library corelibrary {

  using SafeERC20                        for                                                             IERC20;
  using SafeMath                         for                                                            uint256;
  using WadMath                          for                                                            uint256;
  using Math                             for                                                            uint256;




          enum tankStatus {INACTIVE, ACTIVE, CLOSED}

          uint256 internal constant SECONDS_PER_YEAR = 365 days;

          // lender is the lp of the stablecoin index backing baseusd
          struct lenderstankdata {
                         // borrow shares of the user of this pool. If user didn't borrow this pool then shere will be 0
                         uint256 borrowShares;
          }

          // the stablecoins index tank === interestbearingtank
          struct interestbearingtankdata {
                         // pool status
                         tankStatus status;
                         // Bast of the pool
                         IBase_usd baseusd;
                         // pool configuration contract
                         IPoolConfiguration poolConfig;
                         // total borrow amount on this pool
                         uint256 totalBorrows;
                         // total share on this pool
                         uint256 totalBorrowShares;
                         // reserve amount on this pool
                         uint256 tankReserves;
                         // last update timestamp of this pool
                         uint256 lastUpdateTimestamp;
         }

         struct borrowerstankdata {
                        // the user set to used this pool as collateral for borrowing
                        bool disableUseAsCollateral;
                        // borrow shares of the user of this pool. If user didn't borrow this pool then shere will be 0
                        uint256 borrowShares;
         }

         struct noninterestbearingtankdata {
                        // pool status
                        tankStatus status;
                        // Token representing collateral shares
                        basecoll baseColl;
                        // pool configuration contract
                        IPoolConfiguration poolConfig;
                        // last update timestamp of this pool
                        uint256 lastUpdateTimestamp;
                        // tank pair for usd price oracle on DIAOracle
                        string usdpair;
         }




         // take in the interest rate derived from the utilization rate , then calculates it for a particular time period
         function calculateLinearInterest(uint256 _rate, uint256 _fromTimestamp, uint256 _toTimestamp)        internal
         pure returns (uint256) {
                 return _rate.wadMul(_toTimestamp.sub(_fromTimestamp)).wadDiv(SECONDS_PER_YEAR).add(WadMath.wad());
         }







}
