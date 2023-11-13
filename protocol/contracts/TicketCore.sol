// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TicketCore {

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
        TicketValueStruct ticketValue;
    }

    uint public gameRounds = 1;
    uint public gameTickets = 1;

    // mapping of rounds to ticket value
    mapping(uint => TicketValueStruct) public results;

    // mapping of rounds to ticket Id, then to Ticket values
    mapping(uint => mapping(uint => TicketStruct)) public _tickets;

    // mapping of rounds to player address, and then to Ticket Id
    mapping(uint => mapping(address => uint)) public myTickets;

    // mapping of ticket values frequencies
    mapping(uint => mapping(uint => uint)) public ticketFrequency1;
    mapping(uint => mapping(uint => uint)) public ticketFrequency2;
    mapping(uint => mapping(uint => uint)) public ticketFrequency3;
    mapping(uint => mapping(uint => uint)) public ticketFrequency4;
    mapping(uint => mapping(uint => uint)) public ticketFrequency5;


    function _saveTicket(TicketValueStruct calldata ticket, uint pricePerTicket) internal {

        // store tickets
        _tickets[gameRounds][gameTickets++] = TicketStruct({
            stakeTime: uint32(block.timestamp),
            amount: pricePerTicket,
            hasClaimedPrize: false,
            ticketValue: ticket
        }); 

        // increase frequencies
        ticketFrequency1[gameRounds][ticket.value1]++;
        ticketFrequency2[gameRounds][ticket.value2]++;
        ticketFrequency3[gameRounds][ticket.value3]++;
        ticketFrequency4[gameRounds][ticket.value4]++;
        ticketFrequency5[gameRounds][ticket.value5]++;

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