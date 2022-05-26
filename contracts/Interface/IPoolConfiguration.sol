// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;



interface IPoolConfiguration { // does six things

            function getOptimalUtilizationRate() external view returns (uint256);

            function getBaseBorrowRate() external view returns (uint256);

            function getLiquidationBonusPercent() external view returns (uint256);

            function getCollateralPercent() external view returns (uint256);

            function calculateInterestRate(uint256 _totalBorrows, uint256 _totalLiquidity)
            external
            view
            returns (uint256 borrowInterestRate);

            function getUtilizationRate(uint256 _totalBorrows, uint256 _totalLiquidity)
            external
            view
            returns (uint256 utilizationRate);
}
