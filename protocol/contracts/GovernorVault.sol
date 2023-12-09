// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "./interface/IPot.sol";
import "./interface/IProposal.sol";
import "./Authorization.sol";

contract GovernorVault is Authorization, IProposal {

    using SafeERC20 for IERC20;

    address public governorToken;

    uint public supportFunds;
    mapping(address => uint) public userSupportFunds;

    uint public voteFunds;
    mapping(address => uint) public userVotes;
    mapping(address => uint) public userVoteAbstained;
    mapping(address => uint) public userVoteFor;
    mapping(address => uint) public userVoteAgainst;

    uint [] assetBalances;


    uint8 public percentToBurn;
    uint8 public percentForSponsors;

    function fund(address[] memory assets, uint[] memory _assetBalances) external {
        supportedTokenArray = assets;
        assetBalances = _assetBalances;
    }

    function support(address owner, uint amount) external onlyFactory {
        supportFunds += amount;
        userSupportFunds[owner] += amount;
    }

    function vote(address owner, Vote _vote,  uint amount) external onlyFactory {
        voteFunds += amount;
        userVotes[owner] += amount;
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

    function burnTokens(ProposalStatus status, uint voteFor, uint voteAgainst) external onlyFactory {

        // uint totalBalance = IERC20(governorToken).balanceOf(address(this));

        // uint burnAmount = voteFunds * percentToBurn / 100;

        // if (status == ProposalStatus.Executed) {
        //     ERC20Burnable(governorToken).burn(burnAmount);
        // } else if (status == ProposalStatus.Rejected) {
        //     ERC20Burnable(governorToken).burn(burnAmount);
        // } else {
        //     uint total = voteFor + voteAgainst;
        //     if (total == 0) total = 1;
        //     uint _percentToBurn = voteAgainst / total;
        //     // uint amountToBurn = mySupport * _percentToBurn / 100;
        //     // uint amountToSend = mySupport - amountToBurn;
        //     // IERC20(governorToken).safeTransfer(owner, amountToSend);
        //     // ERC20Burnable(governorToken).burn(amountToBurn);
        // }

    }

    function claimFunds(address owner, ProposalStatus status, uint voteFor, uint voteAgainst) external onlyFactory  {

        uint myVotes = userVotes[owner];
        userVotes[owner] = 0;

        uint mySupport = userSupportFunds[owner];
        userSupportFunds[owner] = 0;

        if (mySupport > 0) {     

            if (status == ProposalStatus.Executed) {
                IERC20(governorToken).safeTransfer(owner, mySupport);
                uint share = percentForSponsors * supportFunds / mySupport;
                _withdraw(owner, share);
            } else if (status == ProposalStatus.Failed) {
                uint amountToBurn = mySupport * percentToBurn / 100;
                uint amountToSend = mySupport - amountToBurn;
                IERC20(governorToken).safeTransfer(owner, amountToSend);
                ERC20Burnable(governorToken).burn(amountToBurn);
            } else {
                uint total = voteFor + voteAgainst;
                if (total == 0) total = 1;
                uint _percentToBurn = voteAgainst / total;
                uint amountToBurn = mySupport * _percentToBurn / 100;
                uint amountToSend = mySupport - amountToBurn;
                IERC20(governorToken).safeTransfer(owner, amountToSend);
                ERC20Burnable(governorToken).burn(amountToBurn);
            }

            console.log(mySupport);

        }

        if (myVotes > 0) {     
            uint amountToBurn = myVotes * percentToBurn / 100;
            uint amountToSend = myVotes - amountToBurn;

            if (status == ProposalStatus.Executed) {
                uint share = (100 - percentForSponsors) * voteFunds / myVotes;
                _withdraw(owner, share);
            } else {
                uint share = 100 * voteFunds / myVotes;
                _withdraw(owner, share);
            }

            IERC20(governorToken).safeTransfer(owner, amountToSend);
            ERC20Burnable(governorToken).burn(amountToBurn);

    
        }

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
        userVotes[owner] -= amount;

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

    function _withdraw(address owner, uint share) internal {
        for (uint i = 0; i < supportedTokenArray.length; ++i) {
            address token = supportedTokenArray[i];
            console.log("my share");
            console.log(share);
            uint amount = assetBalances[i] * share / 100;  
            IERC20(token).safeTransfer(owner, amount);   
        }
    }

    function initGovernorToken(address _governorToken) external {
        if (governorToken != address(0)) revert();
        governorToken = _governorToken;
        percentToBurn = 10;
        percentForSponsors = 5;
    }

}
