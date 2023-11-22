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

    // parallel datastructure
    mapping(address => bool) public supportedToken;
    address [] public supportedTokenArray;

    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public tokenInterest;

    // mapping of rounds to pot address
    mapping(uint => address) public pots;

    address public lendingProtocolAddress;
    address public potFactoryAddress;


    function initialize (address _lendingProtocolAddress, address _potFactoryAddress) external onlyOnInitalization {
        lendingProtocolAddress = _lendingProtocolAddress;
        potFactoryAddress = _potFactoryAddress;
    }

    function increaseBalance(address token, uint amount) external onlyFactory {
        tokenBalance[token] += amount;
    }

    function decreaseBalance(address token, uint amount) external onlyFactory {
        tokenBalance[token] -= amount;
    }

    function addSupportedToken(address token) external onlyFactory  {
        supportedToken[token] = true;
        supportedTokenArray.push(token);
    }

    function removeSupportedToken(address token) external onlyFactory  {
        delete supportedToken[token];
    }

    function addInterest(address token, uint amount) external onlyLendingProtocol  {
        tokenInterest[token] += amount;
    }

    function updateVaultShare(uint _vaultShare) external onlyFactory {
        vaultShare = _vaultShare;
    }

    function createPot(uint round) external onlyFactory {
        address pot = createClone(potFactoryAddress);
        
        pots[round] = pot;
    }

    function withdraw(address owner, uint rounds) external onlyFactory {

    }

    function withdrawStake(address owner, uint rounds) external onlyFactory {
        
    }

    modifier onlyLendingProtocol() {
        if (msg.sender != lendingProtocolAddress) revert CallerIsNotLendingProtocol();
        _;
    }

}
