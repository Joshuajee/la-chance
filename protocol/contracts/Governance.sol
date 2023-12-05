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

    error CanOnlyFundPendingProposals(uint proposalId, ProposalStatus status);

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

    constructor (address _governorVaultFactory) {
        governorVaultFactory = _governorVaultFactory;
    }


    function init(address _governanceToken) external {
        governanceToken = _governanceToken;
    }


    function vote(uint proposalId, uint voteWay, uint amount) external onlyGovernorToken {

    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return _propose(targets, values, calldatas, description);
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


    function sponsorProposal (address sponsor, uint proposalId, uint amount) external {

        IProposal.ProposalInfo storage proposal = proposalMapping[proposalId];

        if (proposal.status != ProposalStatus.Pending) revert CanOnlyFundPendingProposals(proposalId, proposal.status);

        uint balance = IERC20(governanceToken).balanceOf(address(this));

        address vault = proposal.vault;

        IERC20(governanceToken).safeTransfer(vault, balance);

        IGovernanceVault(proposal.vault).support(msg.sender, amount);

        uint fundingAmount = IGovernanceVault(vault).supportFunds();

        if (fundingAmount > minSupportThreshold()) {
            proposal.status = ProposalStatus.Active;
            activeProposals.push(proposalId);
        }

        emit SponsorProposal(sponsor, proposalId, amount);

    }

    function minSupportThreshold() public returns(uint) {
        uint totalSupply = IERC20(governanceToken).totalSupply();
        return totalSupply * supportThreshold / PERCENT;
    }

    function minVotingThreshhold () public returns(uint) {
        uint totalSupply = IERC20(governanceToken).totalSupply();
        return totalSupply * quorum / PERCENT;
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
            voteAbstinence: 0
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