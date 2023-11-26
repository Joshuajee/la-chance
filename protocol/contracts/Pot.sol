// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IPot.sol";
import "./Authorization.sol";

contract Pot is IPot, Authorization {

    using SafeERC20 for IERC20;

    uint public totalWinners;
    uint [] assetBalances;

    function initialize(uint winners, address [] memory assets, uint [] memory _assetBalances) external {
        totalWinners = winners;
        supportedTokenArray = assets;
        assetBalances = _assetBalances;
    }

    function withdraw(address owner) external onlyFactory {
        for (uint i = 0; i < supportedTokenArray.length; ++i) {
            address token = supportedTokenArray[i];
            uint amount = assetBalances[i] / totalWinners;  
            IERC20(token).safeTransfer(owner, amount);   
        }
    }



}
