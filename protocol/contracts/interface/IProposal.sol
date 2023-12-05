// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IProposal {

    enum ProposalStatus {
        Pending, 
        Active, 
        Rejected, 
        Executed 
    }

    struct ProposalInfo {
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        string description;
        address vault;
        ProposalStatus status;
        uint voteFor;
        uint voteAgainst;
        uint voteAbstinence;
    }
}