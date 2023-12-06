// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libs/ProposalMapping.sol";
import "./interface/IGovernance.sol";
import "./interface/IProposal.sol";
import "./CloneFactory.sol";
import "./interface/IAuthorization.sol";
import "./interface/IGovernanceVault.sol";

contract Governance is IGovernance, CloneFactory, IProposal {

    event CreateProposal(address indexed creator, uint indexed proposalId);
    event SponsorProposal(address indexed sponsor, uint indexed proposalId, uint amount);
    event CastVote(address indexed voter, uint indexed proposalId, Vote indexed vote, uint amount);
    //event d

    error CanOnlyFundPendingProposals(uint proposalId, ProposalStatus status);
    error CanOnlyVoteOnActiveProposals(uint proposalId, ProposalStatus status);
    error VotingPeriodOver(uint proposalId);
    error CannotExecuteProposal(uint proposalId);

    using SafeERC20 for IERC20;

    mapping(uint => IProposal.ProposalInfo) public proposalMapping;

    uint [] pendingProposals;
    uint [] activeProposals;
    uint [] rejectedProposals;
    uint [] executedProposals;

    address public governorVaultFactory;
    address public governanceToken;

    uint public proposalCounter;

    uint32 public constant PERCENT = 100000;
    uint32 public quorum = 10000; // 10%
    uint32 public supportThreshold = 1; // 0.00001%
    uint64 public votingPeriod = 7200; // Should be a week on production

    constructor (address _governorVaultFactory) {
        governorVaultFactory = _governorVaultFactory;
    }


    function init(address _governanceToken) external {
        governanceToken = _governanceToken;
    }


    function vote(address owner, uint proposalId, Vote _vote, uint amount) external onlyGovernorToken {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        if (proposal.status != ProposalStatus.Active) revert CanOnlyVoteOnActiveProposals(proposalId, proposal.status);

        if (proposal.votingPeriod <= block.timestamp) revert ();

        address vault = proposal.vault;

        if (_vote == Vote.voteFor)
            proposal.voteFor += amount;
        else if (_vote == Vote.voteAgainst)
            proposal.voteAgainst += amount;
        else if (_vote == Vote.abstain)
            proposal.voteAbstinence += amount;

        IGovernanceVault(vault).vote(owner, _vote, amount);

        uint balance = IGovernanceVault(vault).voteFunds();

        IERC20(governanceToken).safeTransfer(vault, balance);

        emit CastVote(owner, proposalId, _vote, amount);

    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return _propose(targets, values, calldatas, description);
    }

    function excute(uint proposalId) public returns (uint256) {
        
        ProposalInfo storage proposal = proposalMapping[proposalId]; 

        if (proposal.votingPeriod > block.timestamp && proposal.status != ProposalStatus.Active) {
            revert CannotExecuteProposal(proposalId);
        } 

        address [] memory targets = proposal.targets;
        uint [] memory values = proposal.values;
        bytes [] memory calldatas = proposal.calldatas;

        uint length = proposal.targets.length;

        for (uint i = 0; i < length; ++i) {
            (bool success, bytes memory returndata) = targets[i].call{value: values[i]}(calldatas[i]);
            //Address.verifyCallResult(success, returndata);
        }

        return proposalId;
    }

    function proposeAndFund(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        uint amount
    ) public returns (uint256) {
        uint id = _propose(targets, values, calldatas, description);
        IGovernance(address(this)).sponsorProposal(msg.sender, id, amount);
        return id;
    }


    function sponsorProposal (address sponsor, uint proposalId, uint amount) external onlyGovernorToken {
        _sponsorProposal(sponsor, proposalId, amount);
    }

    function minSupportThreshold(uint currentSupply) public view returns(uint) {
        return currentSupply * supportThreshold / PERCENT;
    }

    function minVotingThreshhold (uint currentSupply) public view returns(uint) {
        return currentSupply * quorum / PERCENT;
    }

    // Governance Functions
    function setQuorum(uint32 _quorum) external onlyGovernorToken() {
        quorum = _quorum;
    }

    function setSupportThreshold(uint32 _supportThreshold) external onlyGovernorToken() {
        quorum = _supportThreshold;
    }

    function setVotingPeriod(uint32 _votingPeriod) external onlyGovernorToken() {
        votingPeriod = _votingPeriod;
    }

    // Internal Functions
    function _sponsorProposal (address sponsor, uint proposalId, uint amount) internal {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        if (proposal.status != ProposalStatus.Pending) revert CanOnlyFundPendingProposals(proposalId, proposal.status);

        uint balance = IERC20(governanceToken).balanceOf(address(this));

        address vault = proposal.vault;

        IERC20(governanceToken).safeTransfer(vault, balance);

        IGovernanceVault(vault).support(msg.sender, amount);

        uint fundingAmount = IGovernanceVault(vault).supportFunds();

        if (fundingAmount > minSupportThreshold(proposal.currentSupply)) {
            proposal.status = ProposalStatus.Active;
            proposal.votingPeriod = block.timestamp + votingPeriod;
            proposal.currentSupply = IERC20(governanceToken).totalSupply();
            activeProposals.push(proposalId);
        }

        emit SponsorProposal(sponsor, proposalId, amount);
    }

    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) internal returns(uint) {
        address vault = createClone(governorVaultFactory);
        IAuthorization(vault).initFactory(address(this));
        proposalCounter++;
        proposalMapping[proposalCounter] = IProposal.ProposalInfo({
            targets: targets,
            values: values,
            calldatas: calldatas,
            description: description,
            vault: vault,
            status: ProposalStatus.Pending,
            voteFor: 0,
            voteAgainst: 0,
            voteAbstinence: 0,
            votingPeriod: block.timestamp + votingPeriod,
            currentSupply: IERC20(governanceToken).totalSupply()
        });
        pendingProposals.push(proposalCounter);
        emit CreateProposal(msg.sender, proposalCounter);
        return proposalCounter;
    }


    modifier onlyGovernorToken() {
        if (msg.sender != governanceToken) revert(); 
        _;
    }

}