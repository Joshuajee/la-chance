// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

import "./Authorization.sol";

import "hardhat/console.sol";

import "./interface/IGovernance.sol";
import "./interface/IProposal.sol";


contract GovernanceToken is ERC20, Authorization, ERC20Burnable, ERC20Permit, IProposal {

    address public immutable governance;
    constructor(address _governance) ERC20("La Chance Governance Token", "LGT") ERC20Permit("LCG") {
        governance = _governance;
    }

    function mint(address to, uint256 amount) external onlyFactory  {
        _mint(to, amount);
    }

    function vote(uint proposalId, Vote voteWay, uint amount) external {
        _transfer(msg.sender, governance, amount);
        IGovernance(governance).vote(msg.sender, proposalId, voteWay, amount);
    }

    function supportProposal(uint proposalId, uint amount) external {
        _transfer(msg.sender, governance, amount);
        IGovernance(governance).supportProposal(msg.sender, proposalId, amount);
    }
}
