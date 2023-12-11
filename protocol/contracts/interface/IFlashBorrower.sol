// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFlashBorrower {
    error UnAcceptedERC20Token();

    function executeLoan(address _token, address _lenderAddress,  uint _amount) external;
}