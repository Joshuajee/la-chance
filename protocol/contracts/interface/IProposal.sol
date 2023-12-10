// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IProposal {

    enum Vote {
        abstain,
        voteFor, 
        voteAgainst
    }

    enum ProposalStatus {
        Pending, 
        Active, 
        Failed,
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
        uint votingPeriod;
        uint threshold;
    }

    struct ProposalData {
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        string description;
        address vault;
        ProposalStatus status;
        uint voteFor;
        uint voteAgainst;
        uint voteAbstinence;
        uint votingPeriod;
        uint threshold;
        uint id;
        uint supportFunds;
        uint mySupport;
        uint myVotesFor;
        uint myVotesAgainst;
        uint myVotesAbstained;
    }

}