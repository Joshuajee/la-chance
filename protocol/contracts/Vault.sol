// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
//import "hardhat/console.sol";

import './CloneFactory.sol';
import './Authorization.sol';
import './interface/IVault.sol';
import './interface/IPot.sol';
import './interface/ILendingInterface.sol';

contract Vault is CloneFactory, Authorization, IVault {

    error CallerIsNotLendingProtocol();

    uint public vaultShare;

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

    function addInterest(address token, uint amount) external onlyLendingProtocol  {
        tokenInterest[token] += amount;
    }


    function decreaseInterest(address token, uint amount) external onlyLendingProtocol  {
        tokenInterest[token] -= amount;
    }
    
    function clearInterest(address token) external onlyLendingProtocol  {
        tokenInterest[token] = 0;
    }

    function updateVaultShare(uint _vaultShare) external onlyFactory {
        vaultShare = _vaultShare;
    }

    function createPot(uint round, uint winners) external onlyFactory {
        address pot = createClone(potFactoryAddress);
        Authorization(pot).initFactory(address(this));
        (address [] memory assets, uint [] memory assetBalances) = ILendingInterface(lendingProtocolAddress).withdraw(pot);
        IPot(pot).initialize(winners, assets, assetBalances);
        pots[round] = pot;
    }

    function withdraw(address owner, uint round) external onlyFactory {
        IPot(pots[round]).withdraw(owner);
    }

    function withdrawStake(address owner, uint rounds) external onlyFactory {
        
    }

    function getAllInterest() external view returns (uint) {
        return 0;
    }

    modifier onlyLendingProtocol() {
        if (msg.sender != lendingProtocolAddress) revert CallerIsNotLendingProtocol();
        _;
    }

}
