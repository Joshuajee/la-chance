// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each RandomRequest.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

import './Authorization.sol';


contract Chainlink is VRFV2WrapperConsumerBase, Authorization {

    event RandomRequestSent(uint256 requestId, uint32 numWords, uint256 paid);
    event RandomRequestFulfilled(uint256 requestId, uint256[] randomWords, uint256 payment);
    error InsufficientFunds(uint256 balance, uint256 paid);
    error RandomRequestNotFound(uint256 requestId);
    error LinkTransferError(address sender, address receiver, uint256 amount);

    struct RandomRequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the RandomRequest has been successfully fulfilled
        uint256[] randomWords;
    }

    mapping(uint256 => RandomRequestStatus) public s_requests; /* RandomRequestId --> RandomRequestStatus */

    // past RandomRequests Id.
    uint256[] public randomRequestIds;
    uint256 public lastRequestId;

    
    constructor(address _linkAddress, address _wrapperAddress) VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress) {}

    // Depends on the number of RandomRequested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the RandomRequest,
    // and the processing of the callback RandomRequest in the fulfillRandomWords()
    // function.
    // The default is 3, but you can set this higher.
    // For this example, retrieve 2 random values in one RandomRequest.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    function randomRequestRandomWords(uint32 _callbackGasLimit) external returns (uint256 randomRequestId) {
        randomRequestId = requestRandomness(_callbackGasLimit,3, 5);
        uint256 paid = VRF_V2_WRAPPER.calculateRequestPrice(_callbackGasLimit);
        uint256 balance = LINK.balanceOf(address(this));
        if (balance < paid) revert InsufficientFunds(balance, paid);
        s_requests[randomRequestId] = RandomRequestStatus({
            paid: paid,
            randomWords: new uint256[](0),
            fulfilled: false
        });
        randomRequestIds.push(randomRequestId);
        lastRequestId = randomRequestId;
        emit RandomRequestSent(randomRequestId, 5, paid);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        RandomRequestStatus storage randomRequest = s_requests[_requestId];
        if (randomRequest.paid == 0) revert RandomRequestNotFound(_requestId);
        randomRequest.fulfilled = true;
        randomRequest.randomWords = _randomWords;
        emit RandomRequestFulfilled(_requestId, _randomWords, randomRequest.paid);
    }

    function getNumberOfRequests() external view returns (uint256) {
        return randomRequestIds.length;
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        RandomRequestStatus memory randomRequest = s_requests[_requestId];
        if (randomRequest.paid == 0) revert RandomRequestNotFound(_requestId);
        return (randomRequest.paid, randomRequest.fulfilled, randomRequest.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink(address _receiver) public  {
        bool success = LINK.transfer(_receiver, LINK.balanceOf(address(this)));
        if (!success)
            revert LinkTransferError(
                msg.sender,
                _receiver,
                LINK.balanceOf(address(this))
            );
    }
}
