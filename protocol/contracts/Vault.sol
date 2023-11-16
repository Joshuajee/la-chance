// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import './CloneFactory.sol';
import './Authorization.sol';
import './interface/IVault.sol';

contract Vault is CloneFactory, Authorization, IVault {

    mapping(address => uint) public assetBalance;


    function increaseBalance(address asset, uint amount) external onlyFactory {
        assetBalance[asset] += amount;
    }

    function decreaseBalance(address asset, uint amount) external onlyFactory() {
        assetBalance[asset] -= amount;
    }

}
