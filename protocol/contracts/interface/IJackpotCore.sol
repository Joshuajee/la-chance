// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IJackpotCoreStruct.sol";


interface IJackpotCore is IJackpotCoreStruct {
   

    //function receiveResults(uint[5] memory _results) external;
    function saveTicket(address owner, TicketValueStruct calldata ticket, VaultShare memory _vaultShare, uint pricePerTicket) external;
    function saveResult(TicketValueStruct memory ticket) external;

    function gameRounds() external view returns(uint);
    function gamePeriodHasElasped() external view returns(bool);
    function getTicket(uint round, uint ticketId) external view returns (TicketStruct memory);
    function getPotsWon(uint round, uint ticketId) external view returns (bool one, bool two, bool three, bool four, bool five);

    function potOneWinners(TicketValueStruct memory result) external view returns (uint);
    function potTwoWinners(TicketValueStruct memory result) external view returns (uint);
    function potThreeWinners(TicketValueStruct memory result) external view returns (uint);
    function potFourWinners(TicketValueStruct memory result) external view returns (uint);
    function potFiveWinners(TicketValueStruct memory result) external view returns (uint);
}