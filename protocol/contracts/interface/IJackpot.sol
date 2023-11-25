// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IJackpotCoreStruct.sol";

interface IJackpot is IJackpotCoreStruct {
    error UnAcceptedERC20Token();

    function receiveResults(uint[5] memory _results) external;
    function gamePeriodHasElasped() external view returns (bool);
}