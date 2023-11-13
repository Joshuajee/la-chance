// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface/IJackpot.sol";
import "./CloneFactory.sol";
import "./TicketCore.sol";


contract JackpotBase is IJackpot, TicketCore, CloneFactory {

    using SafeERC20 for IERC20;

    struct PoolShare {
        uint8 pool1;
        uint8 pool2;
        uint8 pool3;
        uint8 pool4;
        uint8 pool5;
        uint8 daoPool;
    }

    // pools contract address
    address public pool1;
    address public pool2;
    address public pool3;
    address public pool4;
    address public pool5;
    address public daoPool;

    PoolShare poolShare = PoolShare(25, 20, 15, 15, 15, 10);



    mapping(address => uint) public acceptedTokenPrize;

    constructor (address tokenAddress, uint amount) {
        acceptedTokenPrize[tokenAddress] = amount;
    }


    function buyTickets(IERC20 token, TicketValueStruct [] calldata tickets) external {
        
        uint pricePerTicket = getTicketPrize(address(token));

        uint8 length = uint8(tickets.length);

        uint amount = pricePerTicket * length;

        token.safeTransferFrom(msg.sender, address(this), amount);

        for (uint8 i = 0; i < length; i++) {
            _saveTicket(tickets[i], pricePerTicket);
        }

    }


    //     function fulfillRandomWords(
    //     uint256 _requestId,
    //     uint256[] memory _randomWords
    // ) internal override {
    //     RequestStatus storage request = s_requests[_requestId];
    //     if (request.paid == 0) revert RequestNotFound(_requestId);
    //     request.fulfilled = true;
    //     request.randomWords = _randomWords;
    //     emit RequestFulfilled(_requestId, _randomWords, request.paid);
    // }


    function getTicketPrize (address token) public returns (uint tokenPrize) {
        tokenPrize = acceptedTokenPrize[token];
        if (tokenPrize == 0) revert UnAcceptedERC20Token();
    }

    // Internal functions

    function _splitStakeToPools(IERC20 token, uint amount) internal {

        PoolShare memory _poolShare = poolShare;

        token.safeTransfer(pool1, amount / _poolShare.pool1);
        token.safeTransfer(pool2, amount /_poolShare.pool2);
        token.safeTransfer(pool3, amount /_poolShare.pool3);
        token.safeTransfer(pool4, amount /_poolShare.pool4);
        token.safeTransfer(pool5, amount /_poolShare.pool5);
        token.safeTransfer(daoPool, amount / _poolShare.daoPool);
    }


    // Governance functions

    function updateAcceptedToken(address tokenAddress, uint amount) private {
        acceptedTokenPrize[tokenAddress] = amount;
    }


}