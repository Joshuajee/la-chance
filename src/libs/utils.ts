export const MIN_AMOUNT = 0.000001

export const dollarFormat = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export const networkNameByChainId = (chainId: number) => {

    switch (chainId) {
        case 1:
            return "Ethereum Mainnet"
        case 5:
            return "Goerli"
        case 56:
            return "BNB Smart Chain Mainnet"
        case 97:
            return "BNB Smart Chain Testnet"
        case 137:
            return "Polygon Mainnet"
        case 80001:
            return "Mumbai"
        case 43113:
            return "Avalance Fuji"
        default:
            return "Unknown Network"
    }

}



export const dateToTimeStamp = (date: Date) => {
    return new Date(date).getTime() / 1000
}


export const moneyFormat = (amount: bigint, decimal = 18n) => {
    return Number(amount / 10n ** decimal).toFixed(4)
}