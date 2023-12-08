// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './CloneFactory.sol';
import './Authorization.sol';
import './Vault.sol';
import './interface/IGovernanceVault.sol';
import './interface/IGovernance.sol';


contract DAOVault is Vault {

    using SafeERC20 for IERC20;

    function withdrawForDAO (address vault, uint totalVotes, uint totalSupply) external onlyGovernor {

        uint percent = totalSupply * 100000 / totalVotes;

        uint length = supportedTokenArray.length;
        address [] memory assets = new address[](length);
        uint [] memory assetBalances = new uint[](length);
        uint count = 0;

        for (uint i = 0; i < length; ++i) {
            address token = supportedTokenArray[i];
            uint amount = tokenInterest[token] * 100000 / percent;  
            tokenInterest[token] -= amount;
            if (amount > 0) {
                IERC20(token).safeTransfer(vault, amount);   
                assets[count] = token;
                assetBalances[count] = amount;
                ++count;
            }      
        }

        IGovernance(governorAddress).fundVault(vault, assets, assetBalances);
    }

}
