// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IJackpotCoreStruct.sol";


interface IGovernance {
    function vote(uint proposalId, uint voteWay, uint amount) external;
}