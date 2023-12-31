// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interface/IJackpot.sol";
import "./interface/IJackpotCore.sol";
import "./CloneFactory.sol";
import './Authorization.sol';
import "./JackpotCore.sol";
import "./LendingProtocol.sol";
import './interface/IVault.sol';
import './interface/ILendingInterface.sol';
import './interface/IGovernanceToken.sol';
import './interface/IGovernance.sol';

//import "hardhat/console.sol";


contract Jackpot is IJackpot, Authorization, CloneFactory {

    error TicketAlreadyClaimed(uint round, uint ticketId);

    error TicketDidntWin(uint round, uint ticketId);
    error MessageNotFromChainlink();

    using SafeERC20 for IERC20;

    // vaults contract address
    struct VaultAddressStruct {
        address vault1;
        address vault2;
        address vault3;
        address vault4;
        address vault5;
        address daoVault;
        address communityVault;
    }

    address public jackpotCoreAddress;
    address public lendingProtocolAddress;
    address public vaultFactoryAddress; 
    address public potFactoryAddress; 
    address public governanceTokenAddress;
    address public chainlinkContractAddress;

    VaultAddressStruct public vaultAddresses;

    mapping(address => uint) public acceptedTokenPrize;

    VaultShare public vaultShare = VaultShare(20, 15, 15, 15, 15, 10, 10);

    uint PERCENT = 100;

    // mapping of game rounds to pots
    //mapping(uint => PotAddressStruct) public potAddressess;

    constructor (address _jackpotCore, address _lendingProtocolAddress, address _chainlinkContractAddress, address _governanceAddress, address _governanceTokenAddress, address _daoVault, address _vaultFactoryAddress, address _potFactoryAddress, address tokenAddress, uint amount) {
        
        _isAddressZero(_jackpotCore);
        _isAddressZero(_lendingProtocolAddress);
        _isAddressZero(_governanceAddress);
        _isAddressZero(_governanceTokenAddress);
        _isAddressZero(_daoVault);
        _isAddressZero(_vaultFactoryAddress);
        _isAddressZero(tokenAddress);
        _isAddressZero(_chainlinkContractAddress);


        acceptedTokenPrize[tokenAddress] = amount;
        jackpotCoreAddress = _jackpotCore;
        lendingProtocolAddress = _lendingProtocolAddress;
        vaultFactoryAddress = _vaultFactoryAddress;
        governanceTokenAddress = _governanceTokenAddress;
        chainlinkContractAddress = _chainlinkContractAddress;

        // Create vaultFactoryAddress
        vaultAddresses = VaultAddressStruct(
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            createClone(vaultFactoryAddress),
            _daoVault,
            createClone(vaultFactoryAddress)
        );

        // Initailized vault Factory
        IAuthorization(vaultAddresses.vault1).initFactory(address(this));
        IAuthorization(vaultAddresses.vault2).initFactory(address(this));
        IAuthorization(vaultAddresses.vault3).initFactory(address(this));
        IAuthorization(vaultAddresses.vault4).initFactory(address(this));
        IAuthorization(vaultAddresses.vault5).initFactory(address(this));
        IAuthorization(vaultAddresses.daoVault).initFactory(address(this));
        IAuthorization(vaultAddresses.communityVault).initFactory(address(this));

        // Initialize Lending protocol

        LendingProtocol(_lendingProtocolAddress).initialize(
            [
                vaultAddresses.vault1,
                vaultAddresses.vault2,
                vaultAddresses.vault3,
                vaultAddresses.vault4,
                vaultAddresses.vault5,
                vaultAddresses.daoVault,
                vaultAddresses.communityVault
            ],
            [
                vaultShare.vault1,
                vaultShare.vault2,
                vaultShare.vault3,
                vaultShare.vault4,
                vaultShare.vault5,
                vaultShare.daoVault,
                vaultShare.communityVault
            ],
            tokenAddress
        );


        Vault(vaultAddresses.vault1).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault2).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault3).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault4).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.vault5).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.daoVault).initialize(_lendingProtocolAddress, _potFactoryAddress);
        Vault(vaultAddresses.communityVault).initialize(_lendingProtocolAddress, _potFactoryAddress);

        supportedToken[tokenAddress] = true;
        supportedTokenArray.push(tokenAddress);

        // Init Governance 
        IAuthorization(vaultAddresses.vault1).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.vault2).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.vault3).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.vault4).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.vault5).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.daoVault).initGovernor(_governanceAddress);
        IAuthorization(vaultAddresses.communityVault).initGovernor(_governanceAddress);

        IAuthorization(_jackpotCore).initGovernor(_governanceAddress);
        IAuthorization(_lendingProtocolAddress).initGovernor(_governanceAddress);
        IAuthorization(_governanceTokenAddress).initGovernor(_governanceAddress);
        IAuthorization(_vaultFactoryAddress).initGovernor(_governanceAddress);
        IAuthorization(_potFactoryAddress).initGovernor(_governanceAddress);
        IAuthorization(_chainlinkContractAddress).initGovernor(_governanceAddress);
        // IAuthorization(vaultAddresses.communityVault).initGovernor(_governanceAddress);
        
        // Init Factory
        IAuthorization(_jackpotCore).initFactory(address(this));
        IAuthorization(_lendingProtocolAddress).initFactory(address(this));
        IAuthorization(_chainlinkContractAddress).initFactory(address(this));
        IAuthorization(_governanceTokenAddress).initFactory(address(this));
        IAuthorization(_vaultFactoryAddress).initFactory(address(this));
        IAuthorization(_potFactoryAddress).initFactory(address(this));


        IGovernance(_governanceAddress).init(_governanceTokenAddress, _daoVault);

    }


    function buyTickets(address token, TicketValueStruct [] calldata tickets) external {

        VaultShare memory _vaultShare = vaultShare;
        
        uint pricePerTicket = getTicketPrize(token);

        uint length = tickets.length;

        uint amount = pricePerTicket * length;

        IERC20(token).safeTransferFrom(msg.sender, lendingProtocolAddress, amount);

        _splitStakeToVaults(token, amount);

        for (uint i = 0; i < length; i++) {
            IJackpotCore(jackpotCoreAddress).saveTicket(msg.sender, token, tickets[i], _vaultShare, pricePerTicket);
        }

        IGovernanceToken(governanceTokenAddress).mint(msg.sender, amount);

    }


    function claimTicket(uint round, uint ticketId) external returns (uint) {
        
        TicketStruct memory ticket = IJackpotCore(jackpotCoreAddress).getTicket(round, ticketId);

        if (ticket.hasClaimedPrize) revert TicketAlreadyClaimed(round, ticketId);

        address owner = ticket.owner;

        address asset = ticket.asset;

        uint amount = ticket.amount;

        VaultAddressStruct memory _vaultAddresses  = vaultAddresses;

        (bool one, bool two, bool three, bool four, bool five) = IJackpotCore(jackpotCoreAddress).getPotsWon(round, ticketId);

        if (!one) {
            if (ticket.stakePeriod < block.timestamp) {
                withdrawStake(owner, asset, round, ticketId, amount);
                return 0;
            } else {
                revert TicketDidntWin(round, ticketId);
            }
        }

        // check pot 1
        if (one) {
            withdrawStake(owner, asset, round, ticketId, amount);
            IVault(_vaultAddresses.vault1).withdraw(owner, round);
        }

        if (two) {
            IVault(_vaultAddresses.vault1).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
        }

        if (three) {
            IVault(_vaultAddresses.vault1).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
        }

        if (four) {
            IVault(_vaultAddresses.vault1).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault4).withdraw(owner, round);
        }

        if (five) {
            IVault(_vaultAddresses.vault1).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault2).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault3).withdraw(owner, round);
            IVault(_vaultAddresses.vault4).withdraw(owner, round);
            IVault(_vaultAddresses.vault4).withdraw(owner, round);
            IVault(_vaultAddresses.vault4).withdraw(owner, round);
            IVault(_vaultAddresses.vault4).withdraw(owner, round);
            IVault(_vaultAddresses.vault5).withdraw(owner, round);
        }

        return 0;

    }

    function withdrawStake(address owner, address asset, uint round, uint ticketId, uint amount) internal {
        ILendingInterface(lendingProtocolAddress).withdrawStake(owner, asset, amount);
        IJackpotCore(jackpotCoreAddress).withdraw(round, ticketId);
        IVault(vaultAddresses.communityVault).withdraw(owner, round);
    }


    function getTicketPrize (address token) public view returns (uint tokenPrize) {
        tokenPrize = acceptedTokenPrize[token];
        if (tokenPrize == 0) revert UnAcceptedERC20Token();
    }


    function receiveResults(uint[5] memory _results) external {
        if (msg.sender != chainlinkContractAddress) revert MessageNotFromChainlink();
        TicketValueStruct memory result = TicketValueStruct({
            value1: _results[0],
            value2: _results[1],
            value3: _results[2],
            value4: _results[3],
            value5: _results[4]
        });
        _createWinningPots(result);
        IJackpotCore(jackpotCoreAddress).saveResult(result);
    }

    function gamePeriodHasElasped() external view returns (bool) {
        return IJackpotCore(jackpotCoreAddress).gamePeriodHasElasped();
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
        IVault(_vaultAddresses.communityVault).increaseBalance(token, amount * _vaultShare.communityVault / PERCENT);
    }


    function _splitStakeFromVaults(address token, uint amount) internal {

        VaultShare memory _vaultShare = vaultShare;

        VaultAddressStruct memory _vaultAddresses = vaultAddresses;

        IVault(_vaultAddresses.vault1).decreaseBalance(token, amount * _vaultShare.vault1 / PERCENT);
        IVault(_vaultAddresses.vault2).decreaseBalance(token, amount * _vaultShare.vault2 / PERCENT);
        IVault(_vaultAddresses.vault3).decreaseBalance(token, amount * _vaultShare.vault3 / PERCENT);
        IVault(_vaultAddresses.vault4).decreaseBalance(token, amount * _vaultShare.vault4 / PERCENT);
        IVault(_vaultAddresses.vault5).decreaseBalance(token, amount * _vaultShare.vault5 / PERCENT);
        IVault(_vaultAddresses.daoVault).decreaseBalance(token, amount * _vaultShare.daoVault / PERCENT);
        IVault(_vaultAddresses.communityVault).decreaseBalance(token, amount * _vaultShare.communityVault / PERCENT);
    }


    function _createWinningPots(TicketValueStruct memory result) internal {

        uint rounds = IJackpotCore(jackpotCoreAddress).gameRounds();
        uint totalTickets = IJackpotCore(jackpotCoreAddress).gameTickets();

        VaultAddressStruct memory _vaultAddresses = vaultAddresses;
        
        uint pot1 = IJackpotCore(jackpotCoreAddress).potOneWinners(rounds, result);
        uint pot2 = IJackpotCore(jackpotCoreAddress).potTwoWinners(rounds, result);
        uint pot3 = IJackpotCore(jackpotCoreAddress).potThreeWinners(rounds, result);
        uint pot4 = IJackpotCore(jackpotCoreAddress).potFourWinners(rounds, result);
        uint pot5 = IJackpotCore(jackpotCoreAddress).potFiveWinners(rounds, result);

        if (pot1 > 0)  {
            IVault(_vaultAddresses.vault1).createPot(rounds, pot1);
        }

        if (pot2 > 0)  {
            IVault(_vaultAddresses.vault2).createPot(rounds, pot2);
        }

        if (pot3 > 0)  {
            IVault(_vaultAddresses.vault3).createPot(rounds, pot3);
        }

        if (pot4 > 0)  {
            IVault(_vaultAddresses.vault4).createPot(rounds, pot4);
        }

        if (pot5 > 0)  {
            IVault(_vaultAddresses.vault5).createPot(rounds, pot5);
        }

        // create community pot
        IVault(_vaultAddresses.communityVault).createPot(rounds, totalTickets);


    }

    // Governance functions

    function updateAcceptedToken(address tokenAddress, uint amount) external onlyGovernor {
        acceptedTokenPrize[tokenAddress] = amount;
    }


}