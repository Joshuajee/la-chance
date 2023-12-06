// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IPot.sol";
import "./interface/IProposal.sol";
import "./Authorization.sol";

contract GovernorVault is Authorization, IProposal {

    uint public supportFunds;
    mapping(address => uint) public userSupportFunds;

    uint public voteFunds;
    mapping(address => uint) public userVoteAbstained;
    mapping(address => uint) public userVoteFor;
    mapping(address => uint) public userVoteAgainst;

    function support(address owner, uint amount) external onlyFactory {
        supportFunds += amount;
        userSupportFunds[owner] += amount;
    }

    function vote(address owner, Vote _vote,  uint amount) external onlyFactory {
        voteFunds += amount;
        if (_vote == Vote.voteFor)
            userVoteFor[owner] += amount;
        else if (_vote == Vote.voteAgainst)
            userVoteAgainst[owner] += amount;
        else if (_vote == Vote.abstain)
            userVoteAbstained[owner] += amount;
    }

}
