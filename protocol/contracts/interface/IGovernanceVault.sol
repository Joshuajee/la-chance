// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IProposal.sol";

interface IGovernanceVault {

    function voteFunds() external view returns (uint); 
    function supportFunds() external view  returns (uint); 

    function userSupportFunds(address owner) external view returns (uint);

    function userVotes(address owner) external view  returns (uint);
    function userVoteAbstained(address owner) external view  returns (uint);
    function userVoteFor(address owner) external view  returns (uint);
    function userVoteAgainst(address owner) external view  returns (uint);

    function support(address owner, uint amount) external;
    function vote(address owner, IProposal.Vote _vote,  uint amount) external;

    function withdrawVote(address owner, IProposal.Vote _vote) external returns(uint);
    function withdrawSupport(address owner) external returns(uint);

    function initGovernorToken(address _governorToken) external;

    function fund(address[] memory assets, uint[] memory assetBalances) external;
    function burnTokens(IProposal.ProposalStatus status, uint voteFor, uint voteAgainst) external;
    function claimFunds(address owner, IProposal.ProposalStatus status, uint voteFor, uint voteAgainst) external;
}