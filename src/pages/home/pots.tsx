import { Address, useContractRead } from "wagmi"
import VaultAbi from "../../abi/contracts/Vault.sol/Vault.json";
import { ADDRESS_ZERO, TEST_USDC } from "@/libs/constants";
import convert from "ethereum-unit-converter";
import useCurrentChainId from "@/hooks/useCurrentChainId";


const Pots = ({title, contractAddr} : {title: string, contractAddr: Address | any}) => {

    const currentChainId = useCurrentChainId()

    const { data, isLoading } = useContractRead({
        abi: VaultAbi,
        address: contractAddr,
        functionName: "tokenInterest",
        args: [TEST_USDC],
        enabled: contractAddr != ADDRESS_ZERO,
        chainId: currentChainId
    })

    //https://lottie.host/1967e79b-05d6-4a1e-a50d-2d3ca3d64787/hniP5LUzEF.json

    return (
        <div className="w-40 h-20 border-[1px] rounded-lg text-white flex flex-col justify-center items-center">
            
            <p className="text-center">
                {isLoading ? "Loading..." : `${(Number(convert(Number(data || 0), "wei").ether)).toFixed(4)} USD` } 
            </p>
            
            <h3 className="text-center">{title}</h3>

        </div>
    )
}

export default Pots