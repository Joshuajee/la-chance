// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './Authorization.sol';
import './Vault.sol';
import './interface/IFlashBorrower.sol';
import './interface/ILendingInterface.sol';
// Uncomment this line to use console.log
import "hardhat/console.sol";


contract LendingProtocol is Authorization, ILendingInterface {

    error DebtWasNotPaid(uint debt, uint amountPaid);

    using SafeERC20 for IERC20;

    uint public interestRate = 9;
    uint16 constant PERCENT = 1000;
    uint32 public constant minLoanAmount = 99999999;

    address public vault1; 
    address public vault2; 
    address public vault3; 
    address public vault4; 
    address public vault5; 
    address public daoVault; 


    uint public vaultShare1; 
    uint public vaultShare2; 
    uint public vaultShare3; 
    uint public vaultShare4; 
    uint public vaultShare5; 
    uint public daoVaultShare; 

    function initialize (address [6] memory vaults, uint[6] memory vaultShare, address token) external onlyOnInitalization {

        initialized = true;

        for (uint index = 0; index < 6; index++) {
            _isAddressZero(vaults[index]);
        }

        vault1 = vaults[0]; 
        vault2 = vaults[1];  
        vault3 = vaults[2]; 
        vault4 = vaults[3]; 
        vault5 = vaults[4];  
        daoVault = vaults[5];  

        vaultShare1 = vaultShare[0]; 
        vaultShare2 = vaultShare[1];  
        vaultShare3 = vaultShare[2]; 
        vaultShare4 = vaultShare[3]; 
        vaultShare5 = vaultShare[4];  
        daoVaultShare = vaultShare[5]; 

        supportedToken[token] = true;
        supportedTokenArray.push(token);
    }

    function updateVault(address _vault, uint _vaultNumber) external onlyGovernor {

        if (_vaultNumber == 1) {
            vault1 = _vault; 
        } else if (_vaultNumber == 2) {
            vault2 = _vault; 
        } else if (_vaultNumber == 3) {
            vault3 = _vault; 
        } else if (_vaultNumber == 4) {
            vault4 = _vault; 
        } else if (_vaultNumber == 5) {
            vault5 = _vault; 
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

    function withdraw (address pot) external isVault returns (address[] memory, uint[] memory) {

        uint length = supportedTokenArray.length;

        address [] memory assets = new address[](length);
        uint [] memory assetBalances = new uint[](length);

        uint count = 0;

        for (uint i = 0; i < length; ++i) {
            address token = supportedTokenArray[i];
            uint amount = Vault(msg.sender).tokenInterest(token);  
            Vault(msg.sender).clearInterest(token);  
            if (amount > 0) {
                IERC20(token).safeTransfer(pot, amount);   
                assets[count] = token;
                assetBalances[count] = amount;
                ++count;
            }      
        }

        return (assets, assetBalances);
    }

    function _shareInterestToVaults (address _token, uint interest) internal {
        Vault(vault1).addInterest(_token, interest * vaultShare1 / PERCENT);
        Vault(vault2).addInterest(_token, interest * vaultShare2 / PERCENT);
        Vault(vault3).addInterest(_token, interest * vaultShare3 / PERCENT);
        Vault(vault4).addInterest(_token, interest * vaultShare4 / PERCENT);
        Vault(vault5).addInterest(_token, interest * vaultShare5 / PERCENT);
        Vault(daoVault).addInterest(_token, interest * daoVaultShare / PERCENT);
    }


    modifier isVault() {
        if (vault1 != msg.sender && vault2 != msg.sender && vault3 != msg.sender && vault4 != msg.sender && vault5 != msg.sender && daoVault != msg.sender) {
            revert ();
        }
        _;
    }


}
