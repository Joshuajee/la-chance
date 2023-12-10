import { DEFAULT_CHAIN_ID } from "@/libs/constants"
import { useNetwork } from "wagmi"

const useCurrentChainId = () => {

    const { chain } = useNetwork()

    if (chain) {
        return chain.id
    }

    return DEFAULT_CHAIN_ID

}

export default useCurrentChainId