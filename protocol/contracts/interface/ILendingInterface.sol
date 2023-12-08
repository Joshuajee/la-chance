// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILendingInterface {
    function withdraw(address pot) external returns (address [] memory, uint [] memory);
    function withdrawStake(address owner, address asset, uint amount) external;
}