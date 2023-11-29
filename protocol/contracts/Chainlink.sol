// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each RandomRequest.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

import './interface/IJackpot.sol';
import "./interface/IJackpotCore.sol";
import './Authorization.sol';


// Note the factory address for this contract is the jackpot address

contract Chainlink is VRFV2WrapperConsumerBase, Authorization {

    event Test();

    error StakingPeriodIsNotOver();

    event RandomRequestSent(uint requestId, uint numWords, uint paid);
    event RandomRequestFulfilled(uint requestId, uint[] randomWords, uint payment);
    error InsufficientFunds(uint balance, uint paid);
    error RandomRequestNotFound(uint requestId);
    error LinkTransferError(address sender, address receiver, uint amount);

    struct RandomRequestStatus {
        uint paid; // amount paid in link
        bool fulfilled; // whether the RandomRequest has been successfully fulfilled
        uint[] randomWords;
    }

    mapping(uint => RandomRequestStatus) public s_requests; /* RandomRequestId --> RandomRequestStatus */

    // past RandomRequests Id.
    uint[] public randomRequestIds;
    uint public lastRequestId;
    
    uint constant public PERCENT = 100;


    
    constructor(address _linkAddress, address _wrapperAddress) VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress) {}

    function randomRequestRandomWords(uint _callbackGasLimit) external canRequestVRF returns (uint randomRequestId) {
        randomRequestId = requestRandomness(uint32(_callbackGasLimit),3, 5);
        uint paid = VRF_V2_WRAPPER.calculateRequestPrice(uint32(_callbackGasLimit));
        uint balance = LINK.balanceOf(address(this));
        if (balance < paid) revert InsufficientFunds(balance, paid);
        s_requests[randomRequestId] = RandomRequestStatus({
            paid: paid,
            randomWords: new uint[](0),
            fulfilled: false
        });
        randomRequestIds.push(randomRequestId);
        lastRequestId = randomRequestId;
        emit RandomRequestSent(randomRequestId, 5, paid);
    }


    function fulfillRandomWords( uint _requestId, uint[] memory _randomWords) internal override {
        RandomRequestStatus storage request = s_requests[_requestId];
        if (request.paid == 0) revert RandomRequestNotFound(_requestId);
        request.fulfilled = true;
        request.randomWords = _randomWords;
        emit Test();
        IJackpot(factoryAddress).receiveResults([
            _increaseRandomness(_randomWords[0]),
            _increaseRandomness(_randomWords[1]),
            _increaseRandomness(_randomWords[2]),
            _increaseRandomness(_randomWords[3]),
            _increaseRandomness(_randomWords[4])
        ]);
        emit RandomRequestFulfilled(_requestId, _randomWords, request.paid);
    }

    function getNumberOfRandomRequests() external view returns (uint) {
        return randomRequestIds.length;
    }

    function getRequestStatus(uint _requestId)
        external
        view
        returns (uint paid, bool fulfilled, uint[] memory randomWords)
    {
        RandomRequestStatus memory randomRequest = s_requests[_requestId];
        if (randomRequest.paid == 0) revert RandomRequestNotFound(_requestId);
        return (randomRequest.paid, randomRequest.fulfilled, randomRequest.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink(address _receiver) external onlyGovernor  {
        bool success = LINK.transfer(_receiver, LINK.balanceOf(address(this)));
        if (!success)
            revert LinkTransferError(
                msg.sender,
                _receiver,
                LINK.balanceOf(address(this))
            );
    }




    function _increaseRandomness(uint word) view internal returns(uint) {
        return  word % PERCENT + 1;
        // unchecked {
        //     return  word * block.timestamp  * block.number % PERCENT + 1;   
        // }
    }



    modifier canRequestVRF() {
        if (!IJackpot(factoryAddress).gamePeriodHasElasped()) revert StakingPeriodIsNotOver();
        _;
    }

}
