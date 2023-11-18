// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import './CloneFactory.sol';


contract Authorization {

    error CallerIsNotFactory();
    error CallerIsNotGovernor();
    error FactoryAlreadyInitialized();
    error GovernorAlreadyInitialized();

    address public factoryAddress;
    address public governorAddress;

    function initFactory(address _factory) external {
        if (factoryAddress != address(0)) revert FactoryAlreadyInitialized(); 
        factoryAddress = _factory;
    }

    function initGovernor(address _governor) external {
        if (governorAddress != address(0)) revert GovernorAlreadyInitialized(); 
        governorAddress = _governor;
    }



    modifier onlyFactory() {
        if (msg.sender != factoryAddress) revert CallerIsNotFactory();
        _;
    }


    modifier onlyGovernor() {
        if (msg.sender != governorAddress) revert CallerIsNotGovernor();
        _;
    }
}
