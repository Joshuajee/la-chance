import { useAccount, useContractWrite } from "wagmi"
import Web3btn from "@/components/utils/Web3btn"
import { TEST_USDC } from "@/libs/constants"
import TestUSDCAbi from "../abi/contracts/mocks/TestUSDC.sol/TestUSDC.json"
import { useEffect } from "react"
import { toast } from "react-toastify"
import convert from "ethereum-unit-converter"

const GetTestToken = () => {

    const { address } = useAccount()

    const amount = 1000

    const { write, isLoading, isError, isSuccess, error } = useContractWrite({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "mint",
        args: [address, convert(amount, "ether").wei]
    })

    useEffect(() => {
        if (isSuccess) toast.success("Minted successfully")
    }, [isSuccess, error])

    useEffect(() => {
        if (isError) toast.error(error?.name)
    }, [isError, error])

    return (
        <main className="flex flex-col items-center ">

            <div className="my-40 mb-20">

                <div className="relative overflow-x-auto sm:rounded-lg">
                   
                    <div className="w-56 px-4">
                        <Web3btn loading={isLoading} onClick={write}>  Mint Test {amount} USDC  </Web3btn>
                    </div>

                </div>

            </div>

        </main>
    )
}


export default GetTestToken