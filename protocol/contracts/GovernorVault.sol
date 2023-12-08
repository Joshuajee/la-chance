// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IPot.sol";
import "./interface/IProposal.sol";
import "./Authorization.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GovernorVault is Authorization, IProposal {

    using SafeERC20 for IERC20;

    address public governorToken;

    uint public supportFunds;
    mapping(address => uint) public userSupportFunds;

    uint public voteFunds;
    mapping(address => uint) public userVoteAbstained;
    mapping(address => uint) public userVoteFor;
    mapping(address => uint) public userVoteAgainst;

    function fund(address[] memory assets, uint[] memory assetBalances) external {

    }

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

    function withdrawVote(address owner, Vote _vote) external onlyFactory returns(uint) {
        return _withdrawVote(owner, _vote);
    }

    function withdrawSupport(address owner) external onlyFactory returns(uint) {
        return _withdrawSupport(owner);
    }


    function _withdrawVote(address owner, Vote _vote) internal returns(uint) {
        uint amount;
        if (_vote == Vote.voteFor)  {
            amount = userVoteFor[owner];
            userVoteFor[owner] = 0;
        }   else if (_vote == Vote.voteAgainst){
            amount = userVoteAgainst[owner];
            userVoteAgainst[owner] = 0;
        } else if (_vote == Vote.abstain) {
            amount = userVoteAbstained[owner];
            userVoteAbstained[owner] = 0;
        }

        voteFunds -= amount;

        IERC20(governorToken).safeTransfer(owner, amount);

        return amount;
    }

    function _withdrawSupport(address owner) internal returns(uint) {
        uint amount = userSupportFunds[owner];
        userSupportFunds[owner] = 0;
        supportFunds -= amount;
        IERC20(governorToken).safeTransfer(owner, amount);
        return amount;
    }

    function initGovernorToken(address _governorToken) external {
        if (governorToken != address(0)) revert();
        governorToken = _governorToken;
    }

}
