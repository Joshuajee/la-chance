// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface IAuthorization {

    error CallerIsNotFactory();
    error CallerIsNotGovernor();
    error FactoryAlreadyInitialized();
    error GovernorAlreadyInitialized();

    error AddressZeroNotAllowed();
    error AlreadyInitialized();
    error CallerIsNotChainlink();

    function initFactory(address _factory) external;
    function initGovernor(address _governor) external;

}
