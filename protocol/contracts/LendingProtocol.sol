// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './Authorization.sol';
import './Vault.sol';
import './interface/IFlashBorrower.sol';
// Uncomment this line to use console.log
import "hardhat/console.sol";


contract LendingProtocol is  Authorization {

    error DebtWasNotPaid(uint debt, uint amountPaid);

    using SafeERC20 for IERC20;

    uint8 public interestRate = 9;
    uint16 constant PERCENT = 1000;
    uint32 public constant minLoanAmount = 99999999;

    address public vaults1; 
    address public vaults2; 
    address public vaults3; 
    address public vaults4; 
    address public vaults5; 
    address public daoVault; 


    uint8 public vaultShare1; 
    uint8 public vaultShare2; 
    uint8 public vaultShare3; 
    uint8 public vaultShare4; 
    uint8 public vaultShare5; 
    uint8 public daoVaultShare; 

    function initialize (address [6] memory vaults, uint8[6] memory vaultShare) external onlyOnInitalization {

        initialized = true;

        for (uint256 index = 0; index < 6; index++) {
            _isAddressZero(vaults[index]);
        }

        vaults1 = vaults[0]; 
        vaults2 = vaults[1];  
        vaults3 = vaults[2]; 
        vaults4 = vaults[3]; 
        vaults5 = vaults[4];  
        daoVault = vaults[5];  

        vaultShare1 = vaultShare[0]; 
        vaultShare2 = vaultShare[1];  
        vaultShare3 = vaultShare[2]; 
        vaultShare4 = vaultShare[3]; 
        vaultShare5 = vaultShare[4];  
        daoVaultShare = vaultShare[5]; 
    }

    function updateVault(address _vault, uint _vaultNumber) external onlyGovernor {

        if (_vaultNumber == 1) {
            vaults1 = _vault; 
        } else if (_vaultNumber == 2) {
            vaults2 = _vault; 
        } else if (_vaultNumber == 3) {
            vaults3 = _vault; 
        } else if (_vaultNumber == 4) {
            vaults4 = _vault; 
        } else if (_vaultNumber == 5) {
            vaults5 = _vault; 
        } else if (_vaultNumber == 6) {
            daoVault = _vault; 
        }

    }


    function flashLoan(address _token, address _contract, uint _amount) external {

        uint interest = _amount * interestRate / PERCENT;
        uint debt = _amount + interest;

        IERC20(_token).safeTransfer(_contract, _amount);

        uint balanceAfterLending = IERC20(_token).balanceOf(address(this));

        IFlashBorrower(_contract).executeLoan(_token, address(this), _amount);

        uint balanceAfterLendingPeriod = IERC20(_token).balanceOf(address(this));

        if (balanceAfterLending + debt > balanceAfterLendingPeriod) revert DebtWasNotPaid(debt, balanceAfterLendingPeriod - balanceAfterLending);

        _shareInterestToVaults(_token, interest);
    }


    function _shareInterestToVaults (address _token, uint interest) internal {
        Vault(vaults1).addInterest(_token, interest * vaultShare1 / PERCENT);
        Vault(vaults2).addInterest(_token, interest * vaultShare2 / PERCENT);
        Vault(vaults3).addInterest(_token, interest * vaultShare3 / PERCENT);
        Vault(vaults4).addInterest(_token, interest * vaultShare4 / PERCENT);
        Vault(vaults5).addInterest(_token, interest * vaultShare5 / PERCENT);
        Vault(daoVault).addInterest(_token, interest * daoVaultShare / PERCENT);
    }


}
