// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interface/IBase_usd.sol";
import "./libraries/WadMath.sol";
import "./libraries/Math.sol";
import "./libraries/corelibrary.sol";
import "./BaseCore.sol";
import "./basecollDeployer.sol";
import "./Interface/IDAIoraclePriceGetter.sol";



contract                BaseLend     is                         Ownable                                                          {
                    using SafeERC20                        for                                                             IERC20;
                    using SafeMath                         for                                                            uint256;
                    using WadMath                          for                                                            uint256;
                    using Math                             for                                                            uint256;

                    event NIBTInitialized (
                          address indexed pool,
                          address indexed basecollAddress,
                          address indexed poolConfigAddress
                    );
                    event IBTInitialized  (
                          address indexed baseusdAddress,
                          address indexed poolConfigAddress
                    );
                    event TankPriceOracleUpdated(address indexed priceOracleAddress);

                    event DepositedCollateral (
                          address indexed tank,
                          address indexed user,
                          uint256 depositAmount
                    );

                    event WithdrawnCollateral (
                          address indexed tank,
                          address indexed user,
                          uint256 withdrawAmount
                    );

                    event TankInterestUpdated(
                          address indexed tank,
                          uint256 cumulativeBorrowInterest,
                          uint256 totalBorrows
                    );

                    event Borrow (
                          address indexed tank,
                          address indexed user,
                          uint256 borrowShares,
                          uint256 borrowAmount
                    );


                    event Repay(
                          address indexed tank,
                          address indexed user,
                          uint256 repayShares,
                          uint256 repayAmount
                        );

                    modifier updateTankWithInterestsAndTimestamp() {
                              corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                              uint256 borrowInterestRate = tank.poolConfig.calculateInterestRate(
                                                                                                  tank.totalBorrows,
                                                                                                  getTotalLiquidity(address(tank.baseusd)) // debt + totalAvailableLiquidity - tank reserves
                                                                                                );
                              uint256 cumulativeBorrowInterest = corelibrary.calculateLinearInterest(
                                                                                            borrowInterestRate,
                                                                                            tank.lastUpdateTimestamp,
                                                                                            block.timestamp
                                                                                        );


                              uint256 previousTotalBorrows = tank.totalBorrows;
                              tank.totalBorrows = cumulativeBorrowInterest.wadMul(tank.totalBorrows);
                              tank.tankReserves = tank.tankReserves.add(
                                          tank.totalBorrows.sub(previousTotalBorrows).wadMul(reservePercent)
                              );
                              tank.lastUpdateTimestamp = block.timestamp;
                              emit TankInterestUpdated(address(tank.baseusd), cumulativeBorrowInterest, tank.totalBorrows);
                              _;
                    }

                    uint256            internal          constant                    SECONDS_PER_YEAR    =               365 days;
                    IBase_usd public       /*Use baseusd from this contract (mint burn)*/                                 baseusd;
                    BaseCore  public                                                                                     basecore;

                    mapping(address => corelibrary.interestbearingtankdata)             internal              interestbearingtank;
                    mapping(address => corelibrary.noninterestbearingtankdata)          internal           noninterestbearingtank;
                    // users borrowerstankdata
                    mapping(address => mapping (address => corelibrary.borrowerstankdata)) internal                 borrowerstank;
                    mapping(address => mapping (address => corelibrary.lenderstankdata))   internal                   lenderstank;
                    ERC20[] public interestbearingtanklist; /*type 0*/
                    ERC20[] public noninterestbearingtanklist;

                    BasecollDeployer public basecollDeployer; // the token given inexchange for collateral

                    IDAIoraclePriceGetter priceoracle; // to get usd price


                    uint256 public reservePercent = 0.05 * 1e18;




                    function getTotalAvailableLiquidity (address token)     public view  returns (uint256) {
                                             return IERC20(token).balanceOf(address(basecore));
                    }

                    // debt + totalAvailableLiquidity - tank reserves
                    function getTotalLiquidity(address token)       public     view      returns (uint256) {
                       corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(token)];
                       return
                         tank.totalBorrows.add(getTotalAvailableLiquidity(token)).sub(
                           interestbearingtank[address(token)].tankReserves
                         );
                   }



                 function LendersShareAmount (IBase_usd token, uint256 _amount)    external   view      returns     (uint256)  {
                          corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(token)];
                           uint256 totalLiquidity = getTotalLiquidity(address(token));
                           uint256 totalLiquidityShares = tank.baseusd.totalSupply();
                           if (totalLiquidity == 0 && totalLiquidityShares == 0) {
                             return _amount;
                           }
                          return _amount.mul(totalLiquidityShares).div(totalLiquidity);
                 }




                  function LendersLiquidityAmount (IBase_usd _token, uint256 _shareAmount) external view returns (uint256) {
                                 corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(_token)];
                                 uint256 tankTotalLiquidityShares = tank.baseusd.totalSupply();
                                 if (tankTotalLiquidityShares == 0) {
                                 return 0;
                                 }
                                 return _shareAmount.mul(getTotalLiquidity(address(_token))).div(tankTotalLiquidityShares);
                  }


                           // ===> IBT {Baseusd}, generally this is the token being borrowed, hences accrues interest, as interest for it increases
                           function  initIBT  (ERC20 IBtoken, IPoolConfiguration _poolConfig) external {
                                              for   ( uint256 start = 0; start < interestbearingtanklist.length; start++ )         {
                                              require(interestbearingtanklist[start] != IBtoken, "this pool already exists on lending pool");
                                              }
                                              corelibrary.interestbearingtankdata memory tank = corelibrary.interestbearingtankdata (
                                                                                                         corelibrary.tankStatus.INACTIVE, // status;
                                                                                                         baseusd, // baseusd;
                                                                                                         _poolConfig, // poolConfig;
                                                                                                         0, // totalBorrows
                                                                                                         0, // totalBorrowShares;
                                                                                                         0, // poolReserves;
                                                                                                         block.timestamp // lastUpdateTimestamp;
                                                                                                       );
                                             interestbearingtank[address(IBtoken)] = tank;
                                             interestbearingtanklist.push(IBtoken);
                                             emit IBTInitialized(address(baseusd), address(_poolConfig));
                            }


                           // ===> NIBT {WETH, WBTC} Generally this are tokens used for collateral
                           function initNIBT (ERC20 NIBtoken, IPoolConfiguration _poolConfig, string memory usdpair)           external                           {
                                         for (uint256 start = 0; start < noninterestbearingtanklist.length; start++) {
                                           require(noninterestbearingtanklist[start] != NIBtoken, "this pool already exists on lending pool");
                                         }
                                         string memory TokenSymbol = string(abi.encodePacked("Base", NIBtoken.symbol()));
                                         string memory TokenName = string(abi.encodePacked("BASE", NIBtoken.symbol()));
                                         basecoll baseColl = basecollDeployer.createNewbasecoll(TokenName, TokenSymbol, NIBtoken);
                                         corelibrary.noninterestbearingtankdata memory tank = corelibrary.noninterestbearingtankdata (
                                                                                                     corelibrary.tankStatus.INACTIVE, // status;
                                                                                                     baseColl, // alToken;
                                                                                                     _poolConfig, // poolConfig;
                                                                                                     block.timestamp, // lastUpdateTimestamp;
                                                                                                     usdpair// usdpair for the oracle
                                                                                                   );
                                         noninterestbearingtank[address(NIBtoken)] = tank;
                                         noninterestbearingtanklist.push(NIBtoken);
                                         emit NIBTInitialized(address(NIBtoken), address(baseColl), address(_poolConfig));
                           }


                           function getIBTdata () external view returns (
                                                                                       corelibrary.tankStatus status,
                                                                                       address baseusdAddress,
                                                                                       address poolConfigAddress,
                                                                                       uint256 totalBorrows,
                                                                                       uint256 totalBorrowShares,
                                                                                       uint256 totalLiquidity,
                                                                                       uint256 totalAvailableLiquidity,
                                                                                       uint256 lastUpdateTimestamp) {
                                           corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                                           status = tank.status;
                                           baseusdAddress = address(tank.baseusd);
                                           poolConfigAddress = address(tank.poolConfig);
                                           totalBorrows = tank.totalBorrows;
                                           totalBorrowShares = tank.totalBorrowShares;
                                           totalLiquidity = getTotalLiquidity(address(baseusd));
                                           totalAvailableLiquidity = getTotalAvailableLiquidity(address(baseusd));
                                           lastUpdateTimestamp = tank.lastUpdateTimestamp;
                           }

                           function getNIBTdata (address token) external view returns (
                                                                                       corelibrary.tankStatus status,
                                                                                       address baseCollAddress,
                                                                                       address poolConfigAddress,
                                                                                       uint256 totalAvailableLiquidity,
                                                                                       uint256 lastUpdateTimestamp,
                                                                                       string memory usdpair) {
                                           corelibrary.noninterestbearingtankdata storage tank = noninterestbearingtank[token];
                                           status = tank.status;
                                           baseCollAddress = address(tank.baseColl);
                                           poolConfigAddress = address(tank.poolConfig);
                                           totalAvailableLiquidity = getTotalAvailableLiquidity(token);
                                           lastUpdateTimestamp = tank.lastUpdateTimestamp;
                                           usdpair = tank.usdpair;
                           }



                           function setPriceOracle (IDAIoraclePriceGetter priceoracle_) external      onlyOwner    {
                                           priceoracle = priceoracle_;
                                           emit TankPriceOracleUpdated(address(priceoracle_));
                           }

                           function setTokens (address baseusd_, address basecore_, BasecollDeployer basecollDeployer_)       external      onlyOwner                   {
                                               baseusd = IBase_usd(baseusd_);
                                               basecore = BaseCore(basecore_);
                                               basecollDeployer = basecollDeployer_;
                           }

                           function setIBTStatus (ERC20 token, corelibrary.tankStatus _status) external onlyOwner {
                                     corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(token)];
                                     tank.status = _status;
                           }

                           function setNIBTStatus(ERC20 token, corelibrary.tankStatus _status) external onlyOwner {
                                     corelibrary.noninterestbearingtankdata storage tank = noninterestbearingtank[address(token)];
                                     tank.status = _status;
                           }

                           function calculateRoundUpBorrowAmount  (address _token, uint256 _shareAmount)   internal view returns (uint256)       {
                                       corelibrary.interestbearingtankdata storage tank = interestbearingtank[_token];
                                       if (tank.totalBorrows == 0 || tank.totalBorrowShares == 0) {
                                             return _shareAmount;
                                       }
                                       return _shareAmount.mul(tank.totalBorrows).divCeil(tank.totalBorrowShares);
                           }

                           function getUserCompoundedBorrowBalance   (address _user)  public  view    returns     (uint256)      {
                                  uint256 userBorrowShares = borrowerstank[_user][address(baseusd)].borrowShares;
                                  return calculateRoundUpBorrowAmount(address(baseusd), userBorrowShares);
                           }

                           function getUserTankData(address _user, ERC20 _token) public  view  returns (uint256 compoundedLiquidityBalance, bool userUsePoolAsCollateral) {
                                  compoundedLiquidityBalance = getUserCompoundedLiquidityBalance(_user, _token);
                                  userUsePoolAsCollateral = !borrowerstank[_user][address(_token)].disableUseAsCollateral;
                           }


                           function getUserCompoundedLiquidityBalance(address _user, ERC20 token) public view returns (uint256)  {
                                          corelibrary.noninterestbearingtankdata storage tank = noninterestbearingtank[address(token)];
                                          uint256 userLiquidityShares = tank.baseColl.balanceOf(_user);
                                          return userLiquidityShares;

                           }

                           function getUserAccount (address _user)      public    view   returns     (
                                                                                                       uint256 totalLiquidityBalanceBase,
                                                                                                       uint256 totalCollateralBalanceBase,
                                                                                                       uint256 totalBorrowBalanceBase
                                                                                                     )
                           {
                             // totalBorrow balance of base usd
                               totalBorrowBalanceBase = getUserCompoundedBorrowBalance(_user);
                               // totalLiquidityBalance and collateralbalances
                               for ( uint256 start = 0;    start < noninterestbearingtanklist.length;   start++  )        {
                                 ERC20 token = noninterestbearingtanklist[start];
                                 corelibrary.noninterestbearingtankdata storage NIBtank = noninterestbearingtank[address(token)];
                                 // corelibrary.interestbearingtankdata storage IBtank = interestbearingtank[address(baseusd)];
                                 (uint256 compoundedLiquidityBalance, bool userUsePoolAsCollateral) = getUserTankData(_user, token);

                                  if        ( compoundedLiquidityBalance !=  0 )          {
                                         uint256 collateralPercent = NIBtank.poolConfig.getCollateralPercent();

                                         (uint256 poolPricePerUnit,) = priceoracle.getPrice(NIBtank.usdpair);

                                         require(poolPricePerUnit > 0, "token price isn't correct");
                                         // we round price returne from the oracle to 18 decimals
                                         uint256 liquidityBalanceBase = poolPricePerUnit.mul(1e10).wadMul(compoundedLiquidityBalance);

                                         totalLiquidityBalanceBase = totalLiquidityBalanceBase.add(liquidityBalanceBase);
                                         // this pool can use as collateral when collateralPercent more than 0.
                                         if (collateralPercent > 0 && userUsePoolAsCollateral) {
                                           totalCollateralBalanceBase = totalCollateralBalanceBase.add(
                                             liquidityBalanceBase.wadMul(collateralPercent)
                                           );
                                         }
                                  }
                               }
                             }


                           function depositColl (address token, uint256 quantity) external   updateTankWithInterestsAndTimestamp()     {
                                          corelibrary.noninterestbearingtankdata storage tank = noninterestbearingtank[token];
                                          require(tank.status == corelibrary.tankStatus.ACTIVE, "cannot deposit to this pool, check the pools status");
                                          require(quantity > 0, "deposit amount should more than 0");
                                          // user first deposits collateral
                                          IERC20(token).safeTransferFrom(msg.sender, address(basecore), quantity);
                                          // then he gets an exchangeable share of the collateral
                                          basecoll(tank.baseColl).mint(msg.sender, quantity);

                                          emit DepositedCollateral(address(token), msg.sender,  quantity);

                           }


                           // should update with interest and timestamps
                           function withdrawColl (address token, uint256 quantity)         external   updateTankWithInterestsAndTimestamp()    returns (string memory)     {
                                          corelibrary.noninterestbearingtankdata storage tank = noninterestbearingtank[token];
                                          uint256 baseCollBalance = tank.baseColl.balanceOf(msg.sender);
                                          require(tank.status == corelibrary.tankStatus.ACTIVE, "cannot withdraw from this pool, check the pools status");
                                          require(quantity > 0, "withdraw amount should more than 0");

                                          uint256 withdrawAmount = quantity;
                                            if (withdrawAmount > baseCollBalance) {
                                              withdrawAmount = baseCollBalance;
                                            }
                                          tank.baseColl.burn(msg.sender, withdrawAmount);
                                          basecore.transferCollToUser(token, payable(msg.sender), withdrawAmount);

                                          // // 4. check account health. this transaction will revert if the account of this user is not healthy
                                         require(isAccountHealthy(msg.sender), "account is not healthy. can't withdraw");
                                          emit WithdrawnCollateral (token, msg.sender, withdrawAmount);

                           }


                           function BorrowersShareAmount (address token, uint256 amount)   internal   view   returns (uint256)      {
                                              corelibrary.interestbearingtankdata storage tank = interestbearingtank[token];
                                              // borrow share amount of the first borrowing is equal to amount
                                              if (tank.totalBorrows == 0 || tank.totalBorrowShares == 0) {
                                              return amount;
                                              }
                                              return amount.mul(tank.totalBorrowShares).divCeil(tank.totalBorrows);
                           }


                           function borrowBaseusd (uint256 amount_)        external                   updateTankWithInterestsAndTimestamp()                                {
                                                   corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                                                   corelibrary.borrowerstankdata storage borrower = borrowerstank[msg.sender][address(baseusd)];
                                                   require(tank.status == corelibrary.tankStatus.ACTIVE, "check the tank status, you cant borrow at the moment");
                                                   require(amount_ <= getTotalAvailableLiquidity(address(tank.baseusd)), "amount is more than available baseusd in the tank");

                                                  // 1. calculate borrow share amount
                                                  uint256 borrowShare = BorrowersShareAmount (address(tank.baseusd), amount_);

                                                  // 2. update pool state
                                                  tank.totalBorrows = tank.totalBorrows.add(amount_);
                                                  tank.totalBorrowShares = tank.totalBorrowShares.add(borrowShare);

                                                  // 3. update user state
                                                  borrower.borrowShares = borrower.borrowShares.add(borrowShare);

                                                  // 4. transfer borrowed token from pool to user
                                                  basecore.transferBaseUsdToUser (address(baseusd), payable(msg.sender), amount_);

                                                  // 5. check account health. this transaction will revert if the account of this user is not healthy
                                                  require(isAccountHealthy(msg.sender), "account is not healthy. sorry you cant borrow"); // ==>> this is where you check for collateral
                                                  emit Borrow(address(baseusd), msg.sender, borrowShare, amount_);
                           }



                           function isAccountHealthy (address _user)     public  view     returns    (bool)           {
                                       (, uint256 totalCollateralBalanceBase, uint256 totalBorrowBalanceBase) = getUserAccount(_user);
                                       return totalBorrowBalanceBase <= totalCollateralBalanceBase;
                           }

                            function RepaysShareAmount (address token, uint256 amount)       public   view   returns (uint256)      {
                                              corelibrary.interestbearingtankdata storage tank = interestbearingtank[token];
                                              if      (     tank.totalBorrowShares == 0      )    return 0;
                                              return amount.mul(tank.totalBorrowShares).div(tank.totalBorrows);
                            }


                           function repayBaseUsd (uint256 amount)         external      updateTankWithInterestsAndTimestamp()   {
                                         corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                                         uint256 repayShares = RepaysShareAmount(address(baseusd), amount);
                                         repayInternal(address(tank.baseusd), repayShares);
                           }

                           function repayamountinternal(address baseusd, uint256 repayshares) internal view returns (uint256)         {
                                         corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                                         if (tank.totalBorrows == 0 || tank.totalBorrowShares == 0) return repayshares;
                                         return repayshares.mul(tank.totalBorrows).divCeil(tank.totalBorrowShares);
                           }




                           function repayInternal (address baseusdtank, uint256 repayshares)   internal    {
                                       corelibrary.interestbearingtankdata storage tank = interestbearingtank[address(baseusd)];
                                       corelibrary.borrowerstankdata storage borrower = borrowerstank[msg.sender][address(baseusd)];
                                       require(tank.status == corelibrary.tankStatus.ACTIVE || tank.status == corelibrary.tankStatus.CLOSED,
                                               "can't repay to this pool"
                                               );

                                       if (repayshares > borrower.borrowShares) repayshares = borrower.borrowShares;
                                       // takes in repayshares outputs repayamount
                                       uint256 repayamount = calculateRoundUpBorrowAmount(baseusdtank, repayshares);
                                       tank.totalBorrows = tank.totalBorrows.sub(repayamount);
                                       tank.totalBorrowShares = tank.totalBorrowShares.sub(repayshares);
                                       borrower.borrowShares = borrower.borrowShares.sub(repayshares);

                                       IERC20(address(tank.baseusd)).safeTransferFrom(msg.sender, address(basecore), repayamount);
                                       emit Repay(address(tank.baseusd), msg.sender, repayshares, repayamount);
                           }















}
