import { Address } from "wagmi";

// struct TicketIDStruct {
//     round: boolean,
//     ticketId: boolean,
// }

export interface VaultShare {
    vault1: boolean,
    vault2: boolean,
    vault3: boolean,
    vault4: boolean,
    vault5: boolean,
    daoVault: boolean,
}

export interface TicketValueStruct {
    value1: bigint,
    value2: bigint,
    value3: bigint,
    value4: bigint,
    value5: bigint
}

export interface TicketStruct {
    stakePeriod: bigint,
    amount: boolean,
    hasClaimedPrize: boolean,
    owner: Address,
    ticketValue: TicketValueStruct,
    vaultShare: VaultShare
}

export interface ResultStanding {
    result: TicketValueStruct,
    pot1: bigint,
    pot2: bigint,
    pot3: bigint,
    pot4: bigint,
    pot5: bigint,
}

export interface TicketStanding {
    ticket: TicketStruct,
    won1: boolean,
    won2: boolean,
    won3: boolean,
    won4: boolean,
    won5: boolean,
    hasResult: boolean,
    gameRound: bigint,
    ticketId: bigint
}

