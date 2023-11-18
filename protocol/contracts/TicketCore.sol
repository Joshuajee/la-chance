// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "./TicketBase.sol";

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
    mapping(uint => mapping(uint => uint)) public ticketFrequency1_1;
    mapping(uint => mapping(uint => uint)) public ticketFrequency1_2;
    mapping(uint => mapping(uint => uint)) public ticketFrequency1_3;
    mapping(uint => mapping(uint => uint)) public ticketFrequency1_4;
    mapping(uint => mapping(uint => uint)) public ticketFrequency1_5;


    // 
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_1;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_2;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_3;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_4;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_5;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_6;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_7;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_8;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_9;
    mapping(uint => mapping(uint => mapping(uint => uint))) public ticketFrequency2_10;

    //mapping(uint => mapping(TicketValueStruct => uint)) public ticketFrequency5;

    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_1;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_2;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_3;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_4;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_5;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_6;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_7;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_8;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_9;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))) public ticketFrequency3_10;


    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint))))) public ticketFrequency4_1;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint))))) public ticketFrequency4_2;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint))))) public ticketFrequency4_3;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint))))) public ticketFrequency4_4;
    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint))))) public ticketFrequency4_5;


    mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => mapping(uint => uint)))))) public ticketFrequency5;
  

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

        _increaseFrequencies(ticket);

    }

    function _saveResult(TicketValueStruct calldata ticket) internal {
        results[gameRounds] = ticket;
        _newRound();
    }

    function _newRound() private {
        gameRounds++;
        gameTickets = 1;
    }


    function _increaseFrequencies(TicketValueStruct calldata ticket) internal {

        ++ticketFrequency1_1[gameRounds][ticket.value1];
        ++ticketFrequency1_2[gameRounds][ticket.value2];
        ++ticketFrequency1_3[gameRounds][ticket.value3];
        ++ticketFrequency1_4[gameRounds][ticket.value4];
        ++ticketFrequency1_5[gameRounds][ticket.value5];


        ++ticketFrequency2_1[gameRounds][ticket.value1][ticket.value2];
        ++ticketFrequency2_2[gameRounds][ticket.value1][ticket.value3];
        ++ticketFrequency2_3[gameRounds][ticket.value1][ticket.value4];
        ++ticketFrequency2_4[gameRounds][ticket.value1][ticket.value5];
        ++ticketFrequency2_5[gameRounds][ticket.value2][ticket.value3];
        ++ticketFrequency2_6[gameRounds][ticket.value2][ticket.value4];
        ++ticketFrequency2_7[gameRounds][ticket.value2][ticket.value5];
        ++ticketFrequency2_8[gameRounds][ticket.value3][ticket.value4];
        ++ticketFrequency2_9[gameRounds][ticket.value3][ticket.value5];
        ++ticketFrequency2_10[gameRounds][ticket.value4][ticket.value5];


        ++ticketFrequency3_1[gameRounds][ticket.value1][ticket.value2][ticket.value3];
        ++ticketFrequency3_2[gameRounds][ticket.value1][ticket.value2][ticket.value4];
        ++ticketFrequency3_3[gameRounds][ticket.value1][ticket.value2][ticket.value5];
        ++ticketFrequency3_4[gameRounds][ticket.value1][ticket.value3][ticket.value4];
        ++ticketFrequency3_5[gameRounds][ticket.value1][ticket.value3][ticket.value5];
        ++ticketFrequency3_6[gameRounds][ticket.value1][ticket.value4][ticket.value5];
        ++ticketFrequency3_7[gameRounds][ticket.value2][ticket.value3][ticket.value4];
        ++ticketFrequency3_8[gameRounds][ticket.value2][ticket.value3][ticket.value5];
        ++ticketFrequency3_9[gameRounds][ticket.value2][ticket.value4][ticket.value5];
        ++ticketFrequency3_10[gameRounds][ticket.value3][ticket.value4][ticket.value5];


        ++ticketFrequency4_1[gameRounds][ticket.value1][ticket.value2][ticket.value3][ticket.value4];
        ++ticketFrequency4_2[gameRounds][ticket.value1][ticket.value2][ticket.value3][ticket.value5];
        ++ticketFrequency4_3[gameRounds][ticket.value1][ticket.value2][ticket.value4][ticket.value5];
        ++ticketFrequency4_4[gameRounds][ticket.value1][ticket.value3][ticket.value4][ticket.value5];
        ++ticketFrequency4_5[gameRounds][ticket.value2][ticket.value3][ticket.value4][ticket.value5];

        ++ticketFrequency5[gameRounds][ticket.value1][ticket.value2][ticket.value3][ticket.value4][ticket.value5];


    }






}