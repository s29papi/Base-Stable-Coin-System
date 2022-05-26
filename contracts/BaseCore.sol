// SPDX-License-Identifier: BSD-3-Clause License
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interface/IBaseCore.sol";
import "./Interface/IBase_usd.sol";
import "./Interface/IBase_stables.sol";
import "./Interface/IPoolConfiguration.sol";
import "./Interface/IDAIoraclePriceGetter.sol";
import "./libraries/WadMath.sol";
import "./libraries/Math.sol";
import "./libraries/corelibrary.sol";
import "./basecollDeployer.sol";
import "./BaseLend.sol";



contract BaseCore                                is                                  Ownable                         {
        using SafeERC20                        for                                                             IERC20;
        using SafeMath                         for                                                            uint256;
        using WadMath                          for                                                            uint256;
        using Math                             for                                                            uint256;



        event MintedBaseUSD   (
              address indexed tank,
              address indexed user,
              uint256 shareAmount,
              uint256 mintAmount
        );

        event BurnedBaseUSD   (
              address indexed tank,
              address indexed user,
              uint256 burntAmount
        );




        uint public constant    /*Number of coins in the stable coin index*/    indexNO      =                      5;

        /* ----------------------------->>>>          backingcoins          <<<<----------------------------------- */
        /* ------------------------------>>>>   {FRAX, DAI, USDT, UST, USDC}      <<<<----------------------------- */
        /* -------------------------------------------------------------------------------------------------------- */
        address[indexNO]      /*An array of type address. Contains address of coins in the index*/       backingcoins;
        uint256            internal          constant                    SECONDS_PER_YEAR    =               365 days;
        IBase_usd public       /*Use baseusd from this contract (mint burn)*/                                 baseusd;
        IBase_stables public       /*Use base stables from this contract (mint burn)*/                    basestables;
        BaseLend public                                                                               BaseLendAddress;
        // usercollateralbalances mapping => /*coinaddr => useraddr => amount*/
        mapping (address => uint256)                   public                                         backingbalances;


        constructor (address[indexNO] memory backingcoins_)          {
                             backingcoins = backingcoins_;
        }

        modifier onlyBaseLend {
                  require(address(BaseLendAddress) == msg.sender, "The caller must be BaseLend contract");
                  _;
       }

        function transferCollToUser (address token, address payable user, uint256 amount) external   onlyBaseLend    {
                 IERC20(token).transfer(user, amount);
        }


       function transferBaseUsdToUser (address token, address payable user, uint256 amount) external   onlyBaseLend    {
                IERC20(token).safeTransfer(user, amount);
       }




        function setTokens (address baseusd_, address basestables_, BaseLend BaseLendAddress_)       external      onlyOwner                   {
                            baseusd = IBase_usd(baseusd_);
                            basestables = IBase_stables(basestables_);
                            BaseLendAddress = BaseLendAddress_;
        }

        // mint => /*for mint to be successfull a user has to have the required stable coins*/
        /*The amount of each stable coin deposited is equal to the amount minted divided by the amount of stale coins*/
        function mint (uint amount)          external                 returns (uint amountMinted)                   {
                       uint quantity = amount / 5;
                       string memory deposit = "mint";
                       updateBacking(backingcoins, quantity, amount, deposit);
                       uint256 shareAmount = BaseLendAddress.LendersShareAmount(baseusd,amount);
                       basestables.mint(msg.sender, shareAmount);
                       baseusd.mint(address(this), amount);
                       amountMinted = amount;
                       emit  MintedBaseUSD (address(baseusd), msg.sender, shareAmount, amount);
        }


       function burn (uint amount)          external                      returns (uint amountBurnt)                   {
                      require(
                          amount <= IERC20(address(basestables)).balanceOf(msg.sender),
                          "withdraw amount is not less than or equal to the amount of base stables held"
                      );
                      uint quantity = amount / 5;
                      string memory withdraw = "burn";
                      updateBacking(backingcoins, quantity, amount, withdraw);
                      basestables.burn(msg.sender, amount);
                      baseusd.burn(address(this), amount);
                      amountBurnt = amount;
                      emit  BurnedBaseUSD (address(baseusd), msg.sender, amount);
       }



       // update to reserves
       function updateBacking (address[5] memory coins,  uint256 quantity,  uint256 amountMinted, string memory action)
       internal {
                         // Storing token count to local variable to save on invocation
                         uint256                     count        =                                     coins.length;
                         // Confirm that token set is not empty and it is equal to four
                         require(
                             count     >     0     &&      count        ==        5,
                             "Amount of stablecoins deposited must be equal to five"
                         );
                         // Confirm there is one quantity for every token address
                         require(
                             amountMinted / 5 == quantity,
                             "Quantity of stable coins to be deposited == Amount of stablecoins to be minted divided by 5"
                         );
                         for (  uint   start   =   0;     start       <       count;      start++     )              {
                                if (            quantity              >                0        )          {
                                   exchange (coins[start], quantity, action);
                                }
                         }
                         for (  uint start     =   0;     start       <       count;      start++     )              {
                                updateBalances (coins[start], quantity, amountMinted);
                         }
      }


      function  exchange (address coin, uint256 quantity, string memory action)               internal               {
                         if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("mint")))    {
                              IERC20(coin).safeTransferFrom(msg.sender, address(this), quantity);
                         }
                         if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("burn")))  {
                              uint256 liquidityAmount = BaseLendAddress.LendersLiquidityAmount(baseusd, quantity);
                              IERC20(coin).safeTransfer(msg.sender, liquidityAmount);
                         }
      }


      // update to reserve balance
      function updateBalances (address coin, uint256 quantity, uint256 amount)                 internal                {
                         if       (   getBalance(coin)   <   IERC20(coin).balanceOf(address(this))  )       {
                           if   (amount / 5 == quantity)   {  backingbalances[coin] += quantity; }
                         } else    {
                           if   (amount / 5 == quantity) {  backingbalances[coin] -= quantity; }
                         }
      }

       function getBalance (address coin)                     public       view            returns (uint256)            {
                                return backingbalances[coin];
       }
}
