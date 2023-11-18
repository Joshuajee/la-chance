// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface/IJackpot.sol";
import "./CloneFactory.sol";
import "./TicketCore.sol";
import './Chainlink.sol';
import "./LendingProtocol.sol";
import './interface/IVault.sol';


contract JackpotBase is IJackpot, Chainlink, TicketCore, CloneFactory {

    using SafeERC20 for IERC20;

    uint constant PERCENT = 100;

    // vaults contract address
    struct VaultAddressStruct {
        address vault1;
        address vault2;
        address vault3;
        address vault4;
        address vault5;
        address daoVault;
    }

    struct PotAddressStruct {
        address pot1;
        address pot2;
        address pot3;
        address pot4;
        address pot5;
    }

    address public lendingProtocolAddress;
    address public vaultFactoryAddress; 
    address public potFactoryAddress; 

    VaultAddressStruct public vaultAddresses;

    mapping(address => uint) public acceptedTokenPrize;

    // mapping of game rounds to pots
    mapping(uint => PotAddressStruct) public potAddressess;

    constructor (address _linkAddress, address _wrapperAddress, address _lendingProtocolAddress, address _vaultFactoryAddress, address tokenAddress, uint amount)  Chainlink(_linkAddress, _wrapperAddress) {
        
        acceptedTokenPrize[tokenAddress] = amount;

        lendingProtocolAddress = _lendingProtocolAddress;

        vaultFactoryAddress = _vaultFactoryAddress;

        // Create vaultFactoryAddress
        vaultAddresses = VaultAddressStruct(
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress)
        );


        // Initailized vault Factory
        Authorization(vaultAddresses.vault1).initFactory(address(this));
        Authorization(vaultAddresses.vault2).initFactory(address(this));
        Authorization(vaultAddresses.vault3).initFactory(address(this));
        Authorization(vaultAddresses.vault4).initFactory(address(this));
        Authorization(vaultAddresses.vault5).initFactory(address(this));
        Authorization(vaultAddresses.daoVault).initFactory(address(this));

    }


    function buyTickets(address asset, TicketValueStruct [] calldata tickets) external {

        VaultShare memory _vaultShare = vaultShare;
        
        uint pricePerTicket = getTicketPrize(asset);

        uint8 length = uint8(tickets.length);

        uint amount = pricePerTicket * length;

        IERC20(asset).safeTransferFrom(msg.sender, lendingProtocolAddress, amount);

        _splitStakeTovaults(asset, amount);

        for (uint8 i = 0; i < length; i++) {
            _saveTicket(tickets[i], _vaultShare, pricePerTicket);
        }

    }


    function getTicketPrize (address token) public view returns (uint tokenPrize) {
        tokenPrize = acceptedTokenPrize[token];
        if (tokenPrize == 0) revert UnAcceptedERC20Token();
    }

    // Internal functions

    function _splitStakeTovaults(address asset, uint amount) internal {

        VaultShare memory _vaultShare = vaultShare;

        VaultAddressStruct memory _vaultAddresses = vaultAddresses;

        IVault(_vaultAddresses.vault1).increaseBalance(asset, amount * _vaultShare.vault1 / PERCENT);
        IVault(_vaultAddresses.vault2).increaseBalance(asset, amount * _vaultShare.vault2 / PERCENT);
        IVault(_vaultAddresses.vault3).increaseBalance(asset, amount * _vaultShare.vault3 / PERCENT);
        IVault(_vaultAddresses.vault4).increaseBalance(asset, amount * _vaultShare.vault4 / PERCENT);
        IVault(_vaultAddresses.vault5).increaseBalance(asset, amount * _vaultShare.vault5 / PERCENT);
        IVault(_vaultAddresses.daoVault).increaseBalance(asset, amount * _vaultShare.daovault / PERCENT);
    }


    // Governance functions

    function updateAcceptedToken(address tokenAddress, uint amount) external onlyGovernor {
        acceptedTokenPrize[tokenAddress] = amount;
    }

    function _createPot(bool pot1, bool pot2, bool pot3, bool pot4, bool pot5) private returns(PotAddressStruct memory) {
               
        PotAddressStruct memory potAddressStruct = PotAddressStruct(
            pot1 ? createClone(potFactoryAddress) : address(0),
            pot2 ? createClone(potFactoryAddress) : address(0),
            pot3 ? createClone(potFactoryAddress) : address(0),
            pot4 ? createClone(potFactoryAddress) : address(0),
            pot5 ? createClone(potFactoryAddress) : address(0)
        );
 
        return potAddressStruct;
 
    }


}