// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import './CloneFactory.sol';
import './Authorization.sol';
import './interface/IVault.sol';

contract Vault is CloneFactory, Authorization, IVault {

    error CallerIsNotLendingProtocol();

    uint public vaultShare;

    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public tokenInterest;

    address public lendingProtocolAddress;
    address public potFactoryAddress;


    function initialize (address _lendingProtocolAddress, address _potFactoryAddress) external onlyOnInitalization {
        lendingProtocolAddress = _lendingProtocolAddress;
        createClone(_potFactoryAddress);
    }


    function increaseBalance(address token, uint amount) external onlyFactory {
        tokenBalance[token] += amount;
    }

    function decreaseBalance(address token, uint amount) external onlyFactory() {
        tokenBalance[token] -= amount;
    }

    function addInterest(address token, uint amount) external onlyLendingProtocol  {
        tokenInterest[token] += amount;
    }

    function updateVaultShare(uint _vaultShare) external onlyFactory {
        vaultShare = _vaultShare;
    }


    modifier onlyLendingProtocol() {
        if (msg.sender != lendingProtocolAddress) revert CallerIsNotLendingProtocol();
        _;
    }

}
