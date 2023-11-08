import { useEffect, useState } from "react"
import { useAccount, useNetwork } from "wagmi"


const useContractAddr = () => {

    const { isConnected } = useAccount() 
    const [contract, setContract] = useState("")

    const { chain } = useNetwork()

    useEffect(() => {

        setContract("")

    }, [isConnected, chain?.id])



    return contract
}

export default useContractAddr