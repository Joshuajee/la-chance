// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IProposal.sol";

interface IGovernanceToken {
    function mint(address to, uint256 amount) external;
}