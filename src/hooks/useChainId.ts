import { useNetwork } from "wagmi"

const useChainId = () => {

    const { chain } = useNetwork()

    if (chain) {
        return chain.id
    }

    return 31337

}

export default useChainId