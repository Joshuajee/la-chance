// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./interface/IAuthorization.sol";

abstract contract Authorization is IAuthorization {

    bool initialized = false;

    address public factoryAddress;
    address public governorAddress;
    address public chainlinkAddress;

    function initFactory(address _factory) external {
        _isAddressZero(_factory);
        if (factoryAddress != address(0)) revert FactoryAlreadyInitialized(); 
        factoryAddress = _factory;
    }

    function initGovernor(address _governor) external {
        _isAddressZero(_governor);
        if (governorAddress != address(0)) revert GovernorAlreadyInitialized(); 
        governorAddress = _governor;
    }

    function _isAddressZero(address _address) internal pure {
        if (_address == address(0)) revert();
    }

    modifier onlyFactory() {
        if (msg.sender != factoryAddress) revert CallerIsNotFactory();
        _;
    }


    modifier onlyGovernor() {
        if (msg.sender != governorAddress) revert CallerIsNotGovernor();
        _;
    }

    modifier onlyChainlink() {
        if (msg.sender != chainlinkAddress) revert CallerIsNotChainlink();
        _;
    }

    modifier onlyOnInitalization() {
        if (initialized) revert AlreadyInitialized();
        _;
    }

}
