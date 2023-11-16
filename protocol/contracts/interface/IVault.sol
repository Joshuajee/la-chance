pragma solidity ^0.8.19;

interface IVault {
    function increaseBalance(address asset, uint amount) external;
    function decreaseBalance(address asset, uint amount) external;
}