// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


interface IGovernance {
    function vote(uint proposalId, uint voteWay, uint amount) external;
    function sponsorProposal(address sponsor, uint proposalId, uint amount) external;
}