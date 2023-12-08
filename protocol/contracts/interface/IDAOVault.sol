// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDAOVault {
    function withdrawForDAO(address vault, uint totalVotes, uint totalSupply) external;
}

