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
import "./interface/IDAOVault.sol";

import "hardhat/console.sol";

contract Governance is IGovernance, CloneFactory, IProposal {

    event CreateProposal(address indexed creator, uint indexed proposalId);
    event SupportProposal(address indexed sponsor, uint indexed proposalId, uint amount);
    event CastVote(address indexed voter, uint indexed proposalId, Vote indexed vote, uint amount);
    event WithdrawVote(address indexed voter, uint indexed proposalId, Vote indexed _vote, uint amount);
    event WithdrawSupport(address indexed voter, uint indexed proposalId, uint amount);
    
    //event d

    error CanOnlyFundPendingProposals(uint proposalId, ProposalStatus status);
    error CanOnlyVoteOnActiveProposals(uint proposalId, ProposalStatus status);
    error VotingPeriodOver(uint proposalId);
    error CannotExecuteProposal(uint proposalId);
    error CannotWithdrawSupportNow();
    error CallerNotDAOVault();
    error CannotClaimFundsNow();

    using SafeERC20 for IERC20;

    mapping(uint => ProposalInfo) public proposalMapping;

    uint [] pendingProposals;
    uint [] activeProposals;
    uint [] rejectedProposals;
    uint [] executedProposals;

    address public governorVaultFactory;
    address public daoVault;
    address public governanceToken;

    uint public proposalCounter;

    uint32 public constant PERCENT = 100000;
    uint32 public quorum = 10000; // 10%
    uint32 public supportThreshold = 1; // 0.00001%
    uint64 public votingPeriod = 7200; // Should be a week on production

    constructor (address _governorVaultFactory) {
        governorVaultFactory = _governorVaultFactory;
    }


    function init(address _governanceToken, address _daoVault) external {
        governanceToken = _governanceToken;
        daoVault = _daoVault;
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

    function withdrawVote(uint proposalId, Vote _vote) external  {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        address vault = proposal.vault;

        uint amount = IGovernanceVault(vault).withdrawVote(msg.sender, _vote);

        if (_vote == Vote.voteFor)
            proposal.voteFor -= amount;
        else if (_vote == Vote.voteAgainst)
            proposal.voteAgainst -= amount;
        else if (_vote == Vote.abstain)
            proposal.voteAbstinence -= amount;

        emit WithdrawVote(msg.sender, proposalId, _vote, amount);

    }


    function withdrawSupport(uint proposalId) external  {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        if (proposal.status != ProposalStatus.Pending) revert CannotWithdrawSupportNow();

        address vault = proposal.vault;

        uint amount = IGovernanceVault(vault).withdrawSupport(msg.sender);

        emit WithdrawSupport(msg.sender, proposalId, amount);

    }

    function claimFunds (uint proposalId) external {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        ProposalStatus status = proposal.status;

        if (status == ProposalStatus.Pending || status == ProposalStatus.Active) revert CannotClaimFundsNow();

        IGovernanceVault(proposal.vault).claimFunds(msg.sender, status, proposal.voteFor, proposal.voteAgainst);
        
    }




    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return _propose(targets, values, calldatas, description);
    }

    function execute(uint proposalId) public returns (uint256) {
        
        ProposalInfo storage proposal = proposalMapping[proposalId]; 

        if (proposal.votingPeriod > block.timestamp || proposal.status != ProposalStatus.Active) {
            revert CannotExecuteProposal(proposalId);
        } 

        uint totalVotes = proposal.voteAbstinence + proposal.voteAgainst + proposal.voteFor;

        if (totalVotes > proposal.threshold) {

            if (proposal.voteFor > proposal.voteAgainst) {
                address [] memory targets = proposal.targets;
                uint [] memory values = proposal.values;
                bytes [] memory calldatas = proposal.calldatas;

                uint length = proposal.targets.length;

                for (uint i = 0; i < length; ++i) {
                    (bool success, bytes memory returndata) = targets[i].call{value: values[i]}(calldatas[i]);
                    //Address.verifyCallResult(success, returndata);
                }
                proposal.status = ProposalStatus.Executed;
            } else {
                proposal.status = ProposalStatus.Rejected;
            }
        } else {
            proposal.status = ProposalStatus.Failed;
        }

        address vault = proposal.vault;

        IDAOVault(daoVault).withdrawForDAO(vault, totalVotes, IERC20(governanceToken).totalSupply());

        IGovernanceVault(vault).burnTokens(proposal.status, proposal.voteFor, proposal.voteAgainst);

        return proposalId;
    }


    function fundVault(address vault, address [] memory assets, uint [] memory assetBalances) external {
        if (msg.sender != daoVault) revert CallerNotDAOVault();
        IGovernanceVault(vault).fund(assets, assetBalances);
    }

    // function proposeAndFund(
    //     address[] memory targets,
    //     uint256[] memory values,
    //     bytes[] memory calldatas,
    //     string memory description,
    //     uint amount
    // ) public returns (uint256) {
    //     uint id = _propose(targets, values, calldatas, description);
    //     IGovernance(address(this)).supportProposal(msg.sender, id, amount);
    //     return id;
    // }


    function supportProposal (address sponsor, uint proposalId, uint amount) external onlyGovernorToken {
        _supportProposal(sponsor, proposalId, amount);
    }



    function minSupportThreshold() public view returns(uint) {
        uint bal = IERC20(governanceToken).totalSupply();
        return bal * supportThreshold / PERCENT;
    }

    function minVotingThreshhold() public view returns(uint) {
        uint bal = IERC20(governanceToken).totalSupply();
        return bal * quorum / PERCENT;
    }


    function getProposals(uint start, uint end) external view returns (ProposalInfo [] memory) {

        ProposalInfo [] memory proposals = new ProposalInfo[] (end - start);
        
        uint count = 0;

        for (uint i = end; i > start; --i) {
            proposals[count] = proposalMapping[i];
            ++count;
        }

        return proposals;
        
    }

    function getTotalProposals () view external returns(uint) {
        return proposalCounter;
    }

    // Governance Functions
    function setQuorum(uint32 _quorum) external onlyGovernorToken() {
        quorum = _quorum;
    }

    function setSupportThreshold(uint32 _supportThreshold) external onlyGovernorToken() {
        supportThreshold = _supportThreshold;
    }

    function setVotingPeriod(uint32 _votingPeriod) external onlyGovernorToken() {
        votingPeriod = _votingPeriod;
    }

    // Internal Functions
    function _supportProposal (address sponsor, uint proposalId, uint amount) internal {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        if (proposal.status != ProposalStatus.Pending) revert CanOnlyFundPendingProposals(proposalId, proposal.status);

        uint threshold = proposal.threshold;

        uint balance = IERC20(governanceToken).balanceOf(address(this));

        address vault = proposal.vault;

        // make sure we don't over support the proposal

        uint currentFundingAmount = IGovernanceVault(vault).supportFunds();

        if (currentFundingAmount + balance > threshold) {
            uint returningTokens = currentFundingAmount + balance - threshold;

            // return execess funds to sponsor
            IERC20(governanceToken).safeTransfer(sponsor, returningTokens);
            balance = proposal.threshold - currentFundingAmount;
            IGovernanceVault(vault).support(sponsor, balance);

        } else {
            IGovernanceVault(vault).support(sponsor, amount);
        }


        IERC20(governanceToken).safeTransfer(vault, balance);

        uint fundingAmount = IGovernanceVault(vault).supportFunds();

        if (fundingAmount >= threshold) {
            proposal.status = ProposalStatus.Active;
            proposal.votingPeriod = block.timestamp + votingPeriod;
            proposal.threshold = minVotingThreshhold();
            activeProposals.push(proposalId);
        }

        emit SupportProposal(sponsor, proposalId, amount);
    }

    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) internal returns(uint) {
        address vault = createClone(governorVaultFactory);
        IAuthorization(vault).initFactory(address(this));
        IGovernanceVault(vault).initGovernorToken(governanceToken);
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
            threshold: minSupportThreshold()
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