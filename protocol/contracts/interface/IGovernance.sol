// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IProposal.sol";

interface IGovernance {
    function vote(address owner, uint proposalId, IProposal.Vote vote, uint amount) external;
    function sponsorProposal(address sponsor, uint proposalId, uint amount) external;
}