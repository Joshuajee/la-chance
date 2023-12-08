// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '../interface/IFlashBorrower.sol';

contract FlashBorrowerExample is IFlashBorrower {

    using SafeERC20 for IERC20;

    function executeLoan(address _token, address _lenderAddress,  uint _amount) external {

        IERC20(_token).safeTransfer(_lenderAddress, _amount + (_amount * 9 / 1000));

    }

}