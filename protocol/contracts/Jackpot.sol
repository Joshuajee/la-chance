// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IJackpot.sol";
import "./CloneFactory.sol";
import "./JackpotCore.sol";
import "./LendingProtocol.sol";
import './interface/IVault.sol';

//import "hardhat/console.sol";


contract Jackpot is IJackpot, Authorization, JackpotCore, CloneFactory {

    error TicketAlreadyClaimed(uint round, uint ticketId);

    using SafeERC20 for IERC20;

    // vaults contract address
    struct VaultAddressStruct {
        address vault1;
        address vault2;
        address vault3;
        address vault4;
        address vault5;
        address daoVault;
    }


    address public lendingProtocolAddress;
    address public vaultFactoryAddress; 
    address public potFactoryAddress; 

    VaultAddressStruct public vaultAddresses;

    mapping(address => uint) public acceptedTokenPrize;

    // mapping of game rounds to pots
    //mapping(uint => PotAddressStruct) public potAddressess;

    constructor (address _lendingProtocolAddress, address _vaultFactoryAddress, address _potFactoryAddress, address tokenAddress, uint amount) {
        
        _isAddressZero(_lendingProtocolAddress);
        _isAddressZero(_vaultFactoryAddress);
        _isAddressZero(tokenAddress);

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
        IAuthorization(vaultAddresses.vault1).initFactory(address(this));
        IAuthorization(vaultAddresses.vault2).initFactory(address(this));
        IAuthorization(vaultAddresses.vault3).initFactory(address(this));
        IAuthorization(vaultAddresses.vault4).initFactory(address(this));
        IAuthorization(vaultAddresses.vault5).initFactory(address(this));
        IAuthorization(vaultAddresses.daoVault).initFactory(address(this));

        // Initialize Lending protocol

        LendingProtocol(_lendingProtocolAddress).initialize(
            [
                vaultAddresses.vault1,
                vaultAddresses.vault2,
                vaultAddresses.vault3,
                vaultAddresses.vault4,
                vaultAddresses.vault5,
                vaultAddresses.daoVault
            ],
            [
                vaultShare.vault1,
                vaultShare.vault2,
                vaultShare.vault3,
                vaultShare.vault4,
                vaultShare.vault5,
                vaultShare.daoVault
            ]
        );



        Vault(vaultAddresses.vault1).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault2).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault3).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault4).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault5).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.daoVault).initialize(_lendingProtocolAddress, _potFactoryAddress);

    }


    function buyTickets(address token, TicketValueStruct [] calldata tickets) external {

        VaultShare memory _vaultShare = vaultShare;
        
        uint pricePerTicket = getTicketPrize(token);

        uint length = uint(tickets.length);

        uint amount = pricePerTicket * length;

        IERC20(token).safeTransferFrom(msg.sender, lendingProtocolAddress, amount);

        _splitStakeToVaults(token, amount);

        for (uint i = 0; i < length; i++) {
            _saveTicket(tickets[i], _vaultShare, pricePerTicket);
        }

    }


    function claimTicket(uint round, uint ticketId) external {
        
        TicketStruct storage ticket = _tickets[round][ticketId];

        if (ticket.hasClaimedPrize) revert TicketAlreadyClaimed(round, ticketId);

        uint rounds = gameRounds;

        address owner = ticket.owner;

        VaultAddressStruct memory _vaultAddresses  = vaultAddresses;

        (bool one, bool two, bool three, bool four, bool five) = getPotsWon(round, ticketId);

        // check pot 1
        if (one) {
            //IVault(_vaultAddresses.vault1).withdrawStake(owner, rounds);
            IVault(_vaultAddresses.vault1).withdraw(owner, rounds);
        }

        if (two) {
            IVault(_vaultAddresses.vault2).withdraw(owner, rounds);
        }

        if (three) {
            IVault(_vaultAddresses.vault3).withdraw(owner, rounds);
        }

        if (four) {
            IVault(_vaultAddresses.vault4).withdraw(owner, rounds);
        }

        if (five) {
            IVault(_vaultAddresses.vault5).withdraw(owner, rounds);
        }

    }


    function getTicketPrize (address token) public view returns (uint tokenPrize) {
        tokenPrize = acceptedTokenPrize[token];
        if (tokenPrize == 0) revert UnAcceptedERC20Token();
    }

    function gamePeriodHasElasped() external view returns (bool) {
        return block.timestamp > gamePeriod;
    }


    function receiveResults(uint[5] memory _results) external {
        TicketValueStruct memory result = TicketValueStruct({
            value1: _results[0],
            value2: _results[1],
            value3: _results[2],
            value4: _results[3],
            value5: _results[4]
        });
        _saveResult(result);
    }

    // Internal functions

    function _splitStakeToVaults(address token, uint amount) internal {

        VaultShare memory _vaultShare = vaultShare;

        VaultAddressStruct memory _vaultAddresses = vaultAddresses;

        IVault(_vaultAddresses.vault1).increaseBalance(token, amount * _vaultShare.vault1 / PERCENT);
        IVault(_vaultAddresses.vault2).increaseBalance(token, amount * _vaultShare.vault2 / PERCENT);
        IVault(_vaultAddresses.vault3).increaseBalance(token, amount * _vaultShare.vault3 / PERCENT);
        IVault(_vaultAddresses.vault4).increaseBalance(token, amount * _vaultShare.vault4 / PERCENT);
        IVault(_vaultAddresses.vault5).increaseBalance(token, amount * _vaultShare.vault5 / PERCENT);
        IVault(_vaultAddresses.daoVault).increaseBalance(token, amount * _vaultShare.daoVault / PERCENT);
    }


    function _createWinningPots() internal {
        //if ()
    }


    // Governance functions

    function updateAcceptedToken(address tokenAddress, uint amount) external onlyGovernor {
        acceptedTokenPrize[tokenAddress] = amount;
    }


}