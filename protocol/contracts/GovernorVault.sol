// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IPot.sol";
import "./Authorization.sol";

contract GovernorVault is Authorization {


    uint public supportFunds;
    mapping(address => uint) public userSupportFunds;

    uint public voteFunds;
    mapping(address => uint) public userVoteFunds;

    function support(address owner, uint amount) external onlyFactory {
        supportFunds += amount;
        userSupportFunds[owner] += amount;
    }

    function vote(address owner, uint amount) external onlyFactory {
        voteFunds += amount;
        userVoteFunds[owner] += amount;
    }

    


}
