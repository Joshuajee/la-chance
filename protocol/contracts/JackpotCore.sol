// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


abstract contract JackpotCore {


    struct TicketIDStruct {
        uint round;
        uint ticketId;
    }

    struct VaultShare {
        uint vault1;
        uint vault2;
        uint vault3;
        uint vault4;
        uint vault5;
        uint daoVault;
    }
    
    struct TicketValueStruct {
        uint value1;
        uint value2;
        uint value3;
        uint value4;
        uint value5;
    }

    struct TicketStruct {
        uint stakeTime;
        uint amount;
        bool hasClaimedPrize;
        address owner;
        TicketValueStruct ticketValue;
        VaultShare vaultShare;
    }

    event BuyTicket(address indexed staker, uint indexed gameRound, uint indexed ticketID, TicketValueStruct value);
    event GameResult(uint indexed gameRound, TicketValueStruct result);

    uint constant PERCENT = 100;

    uint public gameRounds = 1;
    uint public gameTickets = 0;

    // store duration for game and stake holding period
    uint public gameDuration = 3600; // 1 hour for testing
    uint public stakingDuration = 14400; // 4 hour for testing

    //The period in which game can't receiver result
    uint public gamePeriod = block.timestamp + gameDuration;

    VaultShare public vaultShare = VaultShare(30, 15, 15, 15, 15, 10);

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


    /*********************************************************************
     *                          Public Functions                         *
     *********************************************************************/


    function getPotsWon(uint gameRound, uint ticketId) view
        public returns (bool one, bool two, bool three, bool four, bool five) {

            TicketValueStruct memory result = results[gameRound];
            TicketStruct memory ticket = _tickets[gameRound][ticketId];

            uint value1 = ticket.ticketValue.value1;
            uint value2 = ticket.ticketValue.value2;
            uint value3 = ticket.ticketValue.value3;
            uint value4 = ticket.ticketValue.value4;
            uint value5 = ticket.ticketValue.value5;

            one = value1 == result.value1 || value2 == result.value2 || value3 == result.value3 ||
                value4 == result.value4 || value5 == result.value5;

            two = _compareTwo([value1, value2], [result.value1, result.value2]) || 
                _compareTwo([value1, value3], [result.value1, result.value3]) ||
                _compareTwo([value1, value4], [result.value1, result.value4]) ||
                _compareTwo([value1, value5], [result.value1, result.value5]) ||
                _compareTwo([value2, value3], [result.value2, result.value3]) ||
                _compareTwo([value2, value4], [result.value2, result.value4]) ||
                _compareTwo([value2, value5], [result.value2, result.value5]) ||
                _compareTwo([value3, value4], [result.value3, result.value4]) ||
                _compareTwo([value3, value5], [result.value3, result.value5]) ||
                _compareTwo([value4, value5], [result.value4, result.value5]);

            three = _compareThree([value1, value2, value3], [result.value1, result.value2, result.value3]) || 
                _compareThree([value1, value2, value4], [result.value1, result.value2, result.value4]) ||
                _compareThree([value1, value2, value5], [result.value1, result.value2, result.value5]) ||
                _compareThree([value1, value3, value4], [result.value1, result.value3, result.value4]) ||
                _compareThree([value1, value3, value5], [result.value1, result.value3, result.value5]) ||
                _compareThree([value1, value4, value5], [result.value1, result.value4, result.value5]) ||
                _compareThree([value2, value3, value4], [result.value2, result.value3, result.value4]) ||
                _compareThree([value2, value3, value5], [result.value2, result.value3, result.value5]) ||
                _compareThree([value2, value4, value5], [result.value2, result.value4, result.value5]) ||
                _compareThree([value3, value4, value5], [result.value3, result.value4, result.value5]);

            four = _compareFour([value1, value2, value3, value4], [result.value1, result.value2, result.value3, result.value4]) || 
                _compareFour([value1, value2, value3, value5], [result.value1, result.value2, result.value3, result.value5]) ||
                _compareFour([value1, value2, value4, value5], [result.value1, result.value2, result.value4, result.value5]) ||
                _compareFour([value1, value3, value4, value5], [result.value1, result.value3, result.value4, result.value5]) ||
                _compareFour([value2, value3, value4, value5], [result.value2, result.value3, result.value4, result.value5]);
        
            five = value1 == result.value1 && value2 == result.value2 && value3 == result.value3 &&
                    value4 == result.value4 && value5 == result.value5;
    }


    // function wonPotOne(uint rounds, TicketValueStruct result) {
    //     return 
    //         ticketFrequency1_1[_rounds][result.value1][result.value2] + 
    //         ticketFrequency1_2[_rounds][result.value1][result.value3] +
    //         ticketFrequency1_3[_rounds][result.value1][result.value4] +
    //         ticketFrequency1_4[_rounds][result.value1][result.value5];
    // }

    function _saveTicket(TicketValueStruct calldata ticket, VaultShare memory _vaultShare, uint pricePerTicket) internal {

        uint _gameRounds = gameRounds;
        uint _gameTickets = ++gameTickets;

        // store tickets
        _tickets[gameRounds][_gameTickets] = TicketStruct({
            stakeTime: uint(block.timestamp),
            amount: pricePerTicket,
            hasClaimedPrize: false,
            owner: msg.sender,
            ticketValue: ticket,
            vaultShare: _vaultShare
        }); 

        myTickets.push(TicketIDStruct({
            round: _gameRounds,
            ticketId: _gameTickets
        }));

        _increaseFrequencies(ticket);

        emit BuyTicket(msg.sender, gameRounds, _gameTickets, ticket);
    }

    function _saveResult(TicketValueStruct memory ticket) internal {
        results[gameRounds] = ticket;
        emit GameResult(gameRounds, ticket);
        _newRound();
    }

    function _newRound() private {
        ++gameRounds;
        gameTickets = 0;
        gamePeriod = block.timestamp + gameDuration;
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

    function _compareTwo(uint[2] memory values, uint[2] memory _results) internal pure returns(bool){
        return values[0] == _results[0] && values[1] == _results[1]; 
    }

    function _compareThree(uint[3] memory values, uint[3] memory _results) internal pure returns(bool){
        return values[0] == _results[0] && values[1] == _results[1] && values[2] == _results[2]; 
    }

    function _compareFour(uint[4] memory values, uint[4] memory _results) internal pure returns(bool){
        return values[0] == _results[0] && values[1] == _results[1] && values[2] == _results[2] && values[3] == _results[3]; 
    }



}