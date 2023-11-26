// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import './Authorization.sol';
import "./interface/IJackpotCore.sol";

contract JackpotCore is Authorization, IJackpotCore {


    event BuyTicket(address indexed staker, uint indexed gameRound, uint indexed ticketID, TicketValueStruct value);
    event GameResult(uint indexed gameRound, TicketValueStruct result);

    uint public gameRounds = 1;
    uint public gameTickets = 0;

    // store duration for game and stake holding period
    uint public gameDuration = 3600; // 1 hour for testing
    uint public stakingDuration = 14400; // 4 hour for testing

    //The period in which game can't receiver result
    uint public gamePeriod = block.timestamp + gameDuration;

    // mapping of rounds to ticket value
    mapping(uint => TicketValueStruct) public results;

    // mapping of rounds to ticket Id, then to Ticket values
    mapping(uint => mapping(uint => TicketStruct)) public tickets;

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


    function gamePeriodHasElasped() external view returns (bool) {
        return block.timestamp > gamePeriod;
    }

    function getTicket(uint round, uint ticketId) external view returns (TicketStruct memory) {
        return tickets[round][ticketId];
    }


    function saveTicket(address owner, TicketValueStruct calldata ticket, VaultShare memory _vaultShare, uint pricePerTicket) external onlyFactory {

        uint _gameRounds = gameRounds;
        uint _gameTickets = ++gameTickets;

        // store tickets
        tickets[gameRounds][_gameTickets] = TicketStruct({
            stakeTime: uint(block.timestamp),
            amount: pricePerTicket,
            hasClaimedPrize: false,
            owner: owner,
            ticketValue: ticket,
            vaultShare: _vaultShare
        }); 

        myTickets.push(TicketIDStruct({
            round: _gameRounds,
            ticketId: _gameTickets
        }));

        _increaseFrequencies(ticket);

        emit BuyTicket(owner, gameRounds, _gameTickets, ticket);
    }

    function saveResult(TicketValueStruct memory ticket) external onlyFactory {
        results[gameRounds] = ticket;
        emit GameResult(gameRounds, ticket);
        _newRound();
    }


    /*********************************************************************
     *                          External Functions                         *
     *********************************************************************/


    function getPotsWon(uint gameRound, uint ticketId) view
        external returns (bool one, bool two, bool three, bool four, bool five) {

            TicketValueStruct memory result = results[gameRound];
            TicketStruct memory ticket = tickets[gameRound][ticketId];

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


    function potOneWinners(TicketValueStruct memory result) external view returns (uint) {
        uint rounds = gameRounds;
        return ( 
            ticketFrequency1_1[rounds][result.value1] + ticketFrequency1_2[rounds][result.value2] +
            ticketFrequency1_3[rounds][result.value3] + ticketFrequency1_4[rounds][result.value4] +
            ticketFrequency1_5[rounds][result.value5]
        );
    }

    function potTwoWinners(TicketValueStruct memory result) public view returns (uint) {
        uint rounds = gameRounds;
        return ( 
            ticketFrequency2_1[rounds][result.value1][result.value2]
            + ticketFrequency2_2[rounds][result.value1][result.value3]
            + ticketFrequency2_3[rounds][result.value1][result.value4]
            + ticketFrequency2_4[rounds][result.value1][result.value5]
            + ticketFrequency2_5[rounds][result.value2][result.value3]
            + ticketFrequency2_6[rounds][result.value2][result.value4]
            + ticketFrequency2_7[rounds][result.value2][result.value5]
            + ticketFrequency2_8[rounds][result.value3][result.value4]
            + ticketFrequency2_9[rounds][result.value3][result.value5]
            + ticketFrequency2_10[rounds][result.value4][result.value5]
        );
    }


    function potThreeWinners(TicketValueStruct memory result) public view returns (uint) {
        uint rounds = gameRounds;
        return ( 
            ticketFrequency3_1[rounds][result.value1][result.value2][result.value3]
            + ticketFrequency3_2[rounds][result.value1][result.value2][result.value4]
            + ticketFrequency3_3[rounds][result.value1][result.value2][result.value5]
            + ticketFrequency3_4[rounds][result.value1][result.value3][result.value4]
            + ticketFrequency3_5[rounds][result.value1][result.value3][result.value5]
            + ticketFrequency3_6[rounds][result.value1][result.value4][result.value5]
            + ticketFrequency3_7[rounds][result.value2][result.value3][result.value4]
            + ticketFrequency3_8[rounds][result.value2][result.value3][result.value5]
            + ticketFrequency3_9[rounds][result.value2][result.value4][result.value5]
            + ticketFrequency3_10[rounds][result.value3][result.value4][result.value5]
        );
    }

    function potFourWinners(TicketValueStruct memory result) public view returns (uint) {
        uint rounds = gameRounds;
        return ( 
            ticketFrequency4_1[rounds][result.value1][result.value2][result.value3][result.value4]
            + ticketFrequency4_2[rounds][result.value1][result.value2][result.value3][result.value5]
            + ticketFrequency4_3[rounds][result.value1][result.value2][result.value4][result.value5]
            + ticketFrequency4_4[rounds][result.value1][result.value3][result.value4][result.value5]
            + ticketFrequency4_5[rounds][result.value2][result.value3][result.value4][result.value5]
        );
    }


    function potFiveWinners(TicketValueStruct memory result) public view returns (uint) {
        uint rounds = gameRounds;
        return ticketFrequency5[rounds][result.value1][result.value2][result.value3][result.value4][result.value5];
    }


    function _newRound() private {
        ++gameRounds;
        gameTickets = 0;
        gamePeriod = block.timestamp + gameDuration;
    }


    function _increaseFrequencies(TicketValueStruct calldata ticket) internal {

        uint round = gameRounds;

        ++ticketFrequency1_1[round][ticket.value1];
        ++ticketFrequency1_2[round][ticket.value2];
        ++ticketFrequency1_3[round][ticket.value3];
        ++ticketFrequency1_4[round][ticket.value4];
        ++ticketFrequency1_5[round][ticket.value5];


        ++ticketFrequency2_1[round][ticket.value1][ticket.value2];
        ++ticketFrequency2_2[round][ticket.value1][ticket.value3];
        ++ticketFrequency2_3[round][ticket.value1][ticket.value4];
        ++ticketFrequency2_4[round][ticket.value1][ticket.value5];
        ++ticketFrequency2_5[round][ticket.value2][ticket.value3];
        ++ticketFrequency2_6[round][ticket.value2][ticket.value4];
        ++ticketFrequency2_7[round][ticket.value2][ticket.value5];
        ++ticketFrequency2_8[round][ticket.value3][ticket.value4];
        ++ticketFrequency2_9[round][ticket.value3][ticket.value5];
        ++ticketFrequency2_10[round][ticket.value4][ticket.value5];


        ++ticketFrequency3_1[round][ticket.value1][ticket.value2][ticket.value3];
        ++ticketFrequency3_2[round][ticket.value1][ticket.value2][ticket.value4];
        ++ticketFrequency3_3[round][ticket.value1][ticket.value2][ticket.value5];
        ++ticketFrequency3_4[round][ticket.value1][ticket.value3][ticket.value4];
        ++ticketFrequency3_5[round][ticket.value1][ticket.value3][ticket.value5];
        ++ticketFrequency3_6[round][ticket.value1][ticket.value4][ticket.value5];
        ++ticketFrequency3_7[round][ticket.value2][ticket.value3][ticket.value4];
        ++ticketFrequency3_8[round][ticket.value2][ticket.value3][ticket.value5];
        ++ticketFrequency3_9[round][ticket.value2][ticket.value4][ticket.value5];
        ++ticketFrequency3_10[round][ticket.value3][ticket.value4][ticket.value5];


        ++ticketFrequency4_1[round][ticket.value1][ticket.value2][ticket.value3][ticket.value4];
        ++ticketFrequency4_2[round][ticket.value1][ticket.value2][ticket.value3][ticket.value5];
        ++ticketFrequency4_3[round][ticket.value1][ticket.value2][ticket.value4][ticket.value5];
        ++ticketFrequency4_4[round][ticket.value1][ticket.value3][ticket.value4][ticket.value5];
        ++ticketFrequency4_5[round][ticket.value2][ticket.value3][ticket.value4][ticket.value5];

        ++ticketFrequency5[round][ticket.value1][ticket.value2][ticket.value3][ticket.value4][ticket.value5];

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