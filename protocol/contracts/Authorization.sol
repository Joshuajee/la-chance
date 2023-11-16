// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import './CloneFactory.sol';


contract Authorization {

    error CallerIsNotFactory();
    error FactoryAlreadyInitialized();

    address public factoryAddress;

    function initFactory(address _factory) external {
        if (factoryAddress != address(0)) revert FactoryAlreadyInitialized(); 
        factoryAddress = _factory;
    }



    modifier onlyFactory() {
        if (msg.sender != factoryAddress) revert CallerIsNotFactory();
        _;
    }
}
