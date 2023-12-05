// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IGovernanceVault {
    
    function voteFunds() external returns (uint); 
    function supportFunds() external returns (uint); 

    function support(address owner, uint amount) external;
    function vote(address owner, uint amount) external;
}