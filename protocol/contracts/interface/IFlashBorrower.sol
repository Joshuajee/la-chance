pragma solidity ^0.8.19;

interface IFlashBorrower {
    error UnAcceptedERC20Token();

    //function flashLoan (address _token, address _contract, uint _amount) external;

    function executeLoan(address _token, address _lenderAddress,  uint _amount) external;
}