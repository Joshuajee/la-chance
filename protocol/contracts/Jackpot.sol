// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IJackpot.sol";
import "./CloneFactory.sol";
import "./JackpotCore.sol";
import './ChainlinkVRF.sol';
import "./LendingProtocol.sol";
import './interface/IVault.sol';

//import "hardhat/console.sol";


contract Jackpot is IJackpot, ChainlinkVRF, JackpotCore, CloneFactory {

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

    constructor (address _linkAddress, address _wrapperAddress, address _lendingProtocolAddress, address _vaultFactoryAddress, address tokenAddress, uint amount)  ChainlinkVRF(_linkAddress, _wrapperAddress) {
        
        _isAddressZero(_linkAddress);
        _isAddressZero(_wrapperAddress);
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
        Authorization(vaultAddresses.vault1).initFactory(address(this));
        Authorization(vaultAddresses.vault2).initFactory(address(this));
        Authorization(vaultAddresses.vault3).initFactory(address(this));
        Authorization(vaultAddresses.vault4).initFactory(address(this));
        Authorization(vaultAddresses.vault5).initFactory(address(this));
        Authorization(vaultAddresses.daoVault).initFactory(address(this));

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



        Vault(vaultAddresses.vault1).initialize(_lendingProtocolAddress);
        Vault(vaultAddresses.vault2).initialize(_lendingProtocolAddress);
        Vault(vaultAddresses.vault3).initialize(_lendingProtocolAddress);
        Vault(vaultAddresses.vault4).initialize(_lendingProtocolAddress);
        Vault(vaultAddresses.vault5).initialize(_lendingProtocolAddress);
        Vault(vaultAddresses.daoVault).initialize(_lendingProtocolAddress);

    }


    function buyTickets(address token, TicketValueStruct [] calldata tickets) external {

        VaultShare memory _vaultShare = vaultShare;
        
        uint pricePerTicket = getTicketPrize(token);

        uint8 length = uint8(tickets.length);

        uint amount = pricePerTicket * length;

        IERC20(token).safeTransferFrom(msg.sender, lendingProtocolAddress, amount);

        _splitStakeTovaults(token, amount);

        for (uint8 i = 0; i < length; i++) {
            _saveTicket(tickets[i], _vaultShare, pricePerTicket);
        }

    }


    function getTicketPrize (address token) public view returns (uint tokenPrize) {
        tokenPrize = acceptedTokenPrize[token];
        if (tokenPrize == 0) revert UnAcceptedERC20Token();
    }


    function randomRequestRandomWords(uint32 _callbackGasLimit) external returns (uint256 randomRequestId) {
        return _randomRequestRandomWords(_callbackGasLimit);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        TicketValueStruct memory result = TicketValueStruct({
            value1: _increaseRandomness(_randomWords[0]),
            value2: _increaseRandomness(_randomWords[1]),
            value3: _increaseRandomness(_randomWords[2]),
            value4: _increaseRandomness(_randomWords[3]),
            value5: _increaseRandomness(_randomWords[4])
        });

        _saveResult(result);
        _fulfillRandomWords(_requestId, _randomWords);
    }

    // Internal functions

    function _splitStakeTovaults(address token, uint amount) internal {

        VaultShare memory _vaultShare = vaultShare;

        VaultAddressStruct memory _vaultAddresses = vaultAddresses;

        IVault(_vaultAddresses.vault1).increaseBalance(token, amount * _vaultShare.vault1 / PERCENT);
        IVault(_vaultAddresses.vault2).increaseBalance(token, amount * _vaultShare.vault2 / PERCENT);
        IVault(_vaultAddresses.vault3).increaseBalance(token, amount * _vaultShare.vault3 / PERCENT);
        IVault(_vaultAddresses.vault4).increaseBalance(token, amount * _vaultShare.vault4 / PERCENT);
        IVault(_vaultAddresses.vault5).increaseBalance(token, amount * _vaultShare.vault5 / PERCENT);
        IVault(_vaultAddresses.daoVault).increaseBalance(token, amount * _vaultShare.daoVault / PERCENT);
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