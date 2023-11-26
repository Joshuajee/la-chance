// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPot {
    function initialize(uint winners, address [] memory assets, uint [] memory assetBalances) external;
    function withdraw(address owner) external;
}