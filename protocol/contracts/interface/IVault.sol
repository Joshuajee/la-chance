// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVault {
    function increaseBalance(address asset, uint amount) external;
    function decreaseBalance(address asset, uint amount) external;
    function withdraw(address owner, uint rounds) external;
    function withdrawStake(address owner, uint round) external;
    function createPot(uint round, uint winners) external;
}