// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


import "./interface/IGovernance.sol";

contract Governance is IGovernance {


    constructor () {

    }


    function vote(uint proposalId, uint voteWay, uint amount) external {

    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

}