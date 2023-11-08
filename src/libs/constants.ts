import { Address } from "wagmi";

export const ZK_SCROLL_CONTRACT = process.env.NEXT_PUBLIC_ZK_SCROLL_CONTRACT as Address

export const ZK_POLYGON_CONTRACT = process.env.NEXT_PUBLIC_ZK_POLYGON_CONTRACT as Address

export const ZK_SCROLL_CHAIN_ID = Number(process.env.NEXT_PUBLIC_ZK_SCROLL_CHAIN_ID)

export const ZK_POLYGON_CHAIN_ID = Number(process.env.NEXT_PUBLIC_ZK_POLYGON_CHAIN_ID)

export const HOST = process.env.NEXT_PUBLIC_HOST


export enum PLAYER_MOVE {
    NONE = 0,
    ROCK =  1,
    PAPER = 2,
    SCISSORS = 3,
}

export enum GAME_OUTCOME {
    DRAW =  0,
    PLAYER_A = 1,
    PLAYER_B = 2
}

export enum FINAL_GAME_STATUS {
    PLAYING = 0,
    PLAYER_WON = 1,
    OPPONENT_WON = 2
}