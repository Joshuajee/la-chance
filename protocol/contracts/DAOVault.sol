// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './CloneFactory.sol';
import './Authorization.sol';
import './Vault.sol';
import './interface/IGovernanceVault.sol';
import './interface/IGovernance.sol';
import './interface/ILendingInterface.sol';


contract DAOVault is Vault {

    using SafeERC20 for IERC20;

    function withdrawForDAO (address vault, uint totalVotes, uint totalSupply) external onlyGovernor {

        uint percent = totalVotes * 1 ether / totalSupply;

        (address [] memory assets, uint [] memory assetBalances) = ILendingInterface(lendingProtocolAddress).withdrawDAO(vault, percent);

        IGovernance(governorAddress).fundVault(vault, assets, assetBalances);
    }

}
