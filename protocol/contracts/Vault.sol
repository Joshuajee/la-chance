// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import './CloneFactory.sol';
import './Authorization.sol';
import './interface/IVault.sol';

contract Vault is CloneFactory, Authorization, IVault {

    uint8 public vaultShare;

    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public tokenInterest;


    function increaseBalance(address token, uint amount) external onlyFactory {
        tokenBalance[token] += amount;
    }

    function decreaseBalance(address token, uint amount) external onlyFactory() {
        tokenBalance[token] -= amount;
    }

    function addInterest(address token, uint amount) external  {
        tokenBalance[token] += amount;
    }

    function updateVaultShare(uint8 _vaultShare) external onlyFactory {
        vaultShare = _vaultShare;
    }

}
