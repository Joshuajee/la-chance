import { Address, useContractRead } from "wagmi"
import VaultAbi from "../../abi/contracts/Vault.sol/Vault.json";
import { TEST_USDC } from "@/libs/constants";


const Pots = ({title, contractAddr} : {title: string, contractAddr: Address | undefined }) => {

    const { data, isLoading } = useContractRead({
        abi: VaultAbi,
        address: contractAddr,
        functionName: "tokenInterest",
        args: [TEST_USDC]
    })

    //https://lottie.host/1967e79b-05d6-4a1e-a50d-2d3ca3d64787/hniP5LUzEF.json


    return (
        <div className="w-40 h-20 border-[1px] rounded-lg text-white">
            
            <p className="text-center">
                {isLoading ? "Loading..." : `${Number(data || 0)} USD` } 
            </p>
            
            <h3 className="text-center">{title}</h3>

        </div>
    )
}

export default Pots