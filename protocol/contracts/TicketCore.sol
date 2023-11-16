// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TicketCore {

    struct TicketIDStruct {
        uint round;
        uint ticketId;
    }
    struct VaultShare {
        uint8 vault1;
        uint8 vault2;
        uint8 vault3;
        uint8 vault4;
        uint8 vault5;
        uint8 daovault;
    }
    
    struct TicketValueStruct {
        uint value1;
        uint value2;
        uint value3;
        uint value4;
        uint value5;
    }

    struct TicketStruct {
        uint32 stakeTime;
        uint amount;
        bool hasClaimedPrize;
        address owner;
        TicketValueStruct ticketValue;
        VaultShare vaultShare;
    }

    uint public gameRounds = 1;
    uint public gameTickets = 1;

    VaultShare public vaultShare = VaultShare(25, 20, 15, 15, 15, 10);

    // mapping of rounds to ticket value
    mapping(uint => TicketValueStruct) public results;

    // mapping of rounds to ticket Id, then to Ticket values
    mapping(uint => mapping(uint => TicketStruct)) public _tickets;

    // mapping of ticket values frequencies
    mapping(uint => mapping(uint => uint)) public ticketFrequency1;
    mapping(uint => mapping(uint => uint)) public ticketFrequency2;
    mapping(uint => mapping(uint => uint)) public ticketFrequency3;
    mapping(uint => mapping(uint => uint)) public ticketFrequency4;
    mapping(uint => mapping(uint => uint)) public ticketFrequency5;


    // Arrays
    TicketIDStruct [] public myTickets;
    TicketIDStruct [] public myOpenTickets;


    function returnWonPots(uint gameRound, TicketStruct memory result) public {
        
    }



    function _saveTicket(TicketValueStruct calldata ticket, VaultShare memory _vaultShare, uint pricePerTicket) internal {

        uint _gameRounds = gameRounds;
        uint _gameTickets = ++gameTickets;

        // store tickets
        _tickets[gameRounds][_gameTickets] = TicketStruct({
            stakeTime: uint32(block.timestamp),
            amount: pricePerTicket,
            hasClaimedPrize: false,
            owner: msg.sender,
            ticketValue: ticket,
            vaultShare: _vaultShare
        }); 

        myOpenTickets.push(TicketIDStruct({
            round: _gameRounds,
            ticketId: _gameTickets
        }));

        // increase frequencies
        ticketFrequency1[_gameRounds][ticket.value1]++;
        ticketFrequency2[_gameRounds][ticket.value2]++;
        ticketFrequency3[_gameRounds][ticket.value3]++;
        ticketFrequency4[_gameRounds][ticket.value4]++;
        ticketFrequency5[_gameRounds][ticket.value5]++;

        // 

    }

    function _saveResult(TicketValueStruct calldata ticket) internal {
        results[gameRounds] = ticket;
        _newRound();
    }

    function _newRound() private {
        gameRounds++;
        gameTickets = 1;
    }






}