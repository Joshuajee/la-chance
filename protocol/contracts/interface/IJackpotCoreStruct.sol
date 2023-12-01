// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IJackpotCoreStruct {

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
        uint communityVault;
    }
    
    struct TicketValueStruct {
        uint value1;
        uint value2;
        uint value3;
        uint value4;
        uint value5;
    }

    struct TicketStruct {
        uint stakePeriod;
        uint amount;
        bool hasClaimedPrize;
        address asset;
        address owner;
        TicketValueStruct ticketValue;
        VaultShare vaultShare;
    }

}