// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Interface/IPoolConfiguration.sol";
import "./libraries/WadMath.sol";


contract DefaultPoolConfiguration is IPoolConfiguration {

        using SafeMath for uint256;
        using WadMath for uint256;

        uint256 public constant OPTIMAL_UTILIZATION_RATE = 0.8 * 1e18;
        // excess utilization rate at 20%
        uint256 public constant EXCESS_UTILIZATION_RATE = 0.2 * 1e18;

        uint256 public baseBorrowRate;
        uint256 public rateSlope1;
        uint256 public rateSlope2;
        uint256 public collateralPercent;
        uint256 public liquidationBonusPercent;
         
        constructor(
                      uint256 _baseBorrowRate,
                      uint256 _rateSlope1,
                      uint256 _rateSlope2,
                      uint256 _collateralPercent,
                      uint256 _liquidationBonusPercent
                    )        public             {
                      baseBorrowRate = _baseBorrowRate;
                      rateSlope1 = _rateSlope1;
                      rateSlope2 = _rateSlope2;
                      collateralPercent = _collateralPercent;
                      liquidationBonusPercent = _liquidationBonusPercent;
        }

        function getBaseBorrowRate() external override(IPoolConfiguration) view returns (uint256) {
        return baseBorrowRate;
        }

        function getCollateralPercent() external override(IPoolConfiguration) view returns (uint256) {
        return collateralPercent;
        }

        function getLiquidationBonusPercent()
        external
        override(IPoolConfiguration)
        view
        returns (uint256)
        {
        return liquidationBonusPercent;
        }

        function calculateInterestRate(uint256 _totalBorrows, uint256 _totalLiquidity)
        external
        override(IPoolConfiguration)
        view
        returns (uint256)
      {
        uint256 utilizationRate = getUtilizationRate(_totalBorrows, _totalLiquidity);

        if (utilizationRate > OPTIMAL_UTILIZATION_RATE) {
          uint256 excessUtilizationRateRatio = utilizationRate.sub(OPTIMAL_UTILIZATION_RATE).wadDiv(
            EXCESS_UTILIZATION_RATE
          );
          return baseBorrowRate.add(rateSlope1).add(rateSlope2.wadMul(excessUtilizationRateRatio));
        } else {
          return
            baseBorrowRate.add(utilizationRate.wadMul(rateSlope1).wadDiv(OPTIMAL_UTILIZATION_RATE));
        }
      }

        function getOptimalUtilizationRate() external override view returns (uint256) {
        return OPTIMAL_UTILIZATION_RATE;
        }

        function getUtilizationRate(uint256 _totalBorrows, uint256 _totalLiquidity)
        public
        override
        view
        returns (uint256)
      {
        return (_totalLiquidity == 0) ? 0 : _totalBorrows.wadDiv(_totalLiquidity);
      }

}
