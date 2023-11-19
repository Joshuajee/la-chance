// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each RandomRequest.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

import './Authorization.sol';
import "hardhat/console.sol";

abstract contract ChainlinkVRF is VRFV2WrapperConsumerBase, Authorization {

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

    function _randomRequestRandomWords(uint32 _callbackGasLimit) internal returns (uint256 randomRequestId) {
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


    function _fulfillRandomWords( uint256 _requestId, uint256[] memory _randomWords) internal {
        RandomRequestStatus storage request = s_requests[_requestId];
        if (request.paid == 0) revert RandomRequestNotFound(_requestId);
        request.fulfilled = true;
        request.randomWords = _randomWords;
        emit RandomRequestFulfilled(_requestId, _randomWords, request.paid);
    }

    function getNumberOfRandomRequests() external view returns (uint256) {
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
    function withdrawLink(address _receiver) external onlyGovernor  {
        bool success = LINK.transfer(_receiver, LINK.balanceOf(address(this)));
        if (!success)
            revert LinkTransferError(
                msg.sender,
                _receiver,
                LINK.balanceOf(address(this))
            );
    }
}
