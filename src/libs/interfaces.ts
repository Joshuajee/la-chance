import { CHAIN_ID, CONTRACT_ADDRESS } from "./enums";
import { SUPPORTED_SYMBOLS } from "./types";

export interface SUPPORTED_NETWORKS {
    name: string,
    description: string,
    icon: string,
    chainId: CHAIN_ID,
    domainId: number,
    contractAddress: CONTRACT_ADDRESS,
    symbol: SUPPORTED_SYMBOLS;
}
