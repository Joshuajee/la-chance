// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./interface/IPot.sol";
import "./Authorization.sol";

contract Pot is IPot, Authorization {

    function withdraw(address owner) external onlyFactory {

    }



}
