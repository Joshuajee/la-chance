// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IProposal.sol";

interface IGovernance {
    function init(address _governanceToken, address _daoVault) external;
    function vote(address owner, uint proposalId, IProposal.Vote vote, uint amount) external;
    function supportProposal(address sponsor, uint proposalId, uint amount) external;
    function fundVault(address vault, address [] memory assets, uint [] memory assetBalances) external;
}