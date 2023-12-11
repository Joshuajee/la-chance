// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './FlashBorrowerExample.sol';
import '../LendingProtocol.sol';

contract BorrowerExample {

    using SafeERC20 for IERC20;

    FlashBorrowerExample borrower;

    constructor () {
        borrower = new FlashBorrowerExample();
    }


    function borrow(LendingProtocol lendingProtocol, address token, uint amount) external {
        uint fee = amount * lendingProtocol.interestRate() / lendingProtocol.PERCENT();
        IERC20(token).safeTransferFrom(msg.sender, address(borrower), fee);
        lendingProtocol.flashLoan(token, address(borrower), amount);
    }

    

}