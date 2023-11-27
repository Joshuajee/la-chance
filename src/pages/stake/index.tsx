import Web3btn from "@/components/utils/Web3btn"
import Predition from "./Prediction"
import LoadingButton from "@/components/utils/LoadingButton"
import { useEffect, useState } from "react"
import JackpotAbi from "./../../abi/contracts/Jackpot.sol/Jackpot.json"
import TestUSDCAbi from "../../abi/contracts/mocks/TestUSDC.sol/TestUSDC.json"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { JACKPOT, TEST_USDC } from "@/libs/constants"
import { toast } from "react-toastify"
interface IStakes {
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    value5: number;
}

const StakePage = () => {

    const { address, isConnected } = useAccount()

    const [stakes, setStakes] = useState<{error: boolean, stakes: IStakes[]}>({ 
        error: true, 
        stakes: [ {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
    })


    const add = () => {
        const temp = [...stakes.stakes, {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
        setStakes({...stakes, stakes: temp})
    }

    // const remove = (index: number) => {
    //     const temp = [...stakes.stakes].splice(index, 1)
    //     console.log(temp)
    //     setStakes({...stakes, stakes: temp})
    // }

    const balance = useContractRead({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "balanceOf",
        args: [address],
        enabled: isConnected
    })

    console.log(balance)

    const approve = useContractWrite({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "approve",
        args: [JACKPOT, "1000000000000000000000000"]
    })

    const buyTickets = useContractWrite({
        abi: JackpotAbi,
        address: JACKPOT,
        functionName: "buyTickets",
        args: [TEST_USDC, stakes.stakes]
    })

    useEffect(() => {
        if (buyTickets.isError) toast.error(buyTickets.error?.message)
    }, [buyTickets.isError, buyTickets.error])


    useEffect(() => {
        if (approve.isError) toast.error(approve.error?.message)
    }, [approve.isError, approve.error])

    return (
        <main className="flex flex-col ">

            <div className="bg-white px-4 rounded-lg  w-[600px] border-slate-200">

                <h3 className="text-center text-3xl font-bold text-gray-800 mt-4">Stake </h3>

                <div className="flex flex-col items-center justify-center my-10">

                    { stakes.stakes.map((stake, index) => {
                        console.log(stake, index)
                        return (
                            <Predition key={index} />
                        )
                    })}

                    <div className="w-80 mt-4">
                        <Web3btn loading={approve.isLoading} onClick={approve.write} color="gray">Approve </Web3btn>
                    </div>

                    <div className="w-80">
                        <Web3btn loading={buyTickets.isLoading} onClick={buyTickets.write}>Stake</Web3btn>
                    </div>     

                    <div className="w-80">
                        <LoadingButton onClick={add} color="gray">Add More</LoadingButton>
                    </div>     
                 
                </div>

            </div>


        </main>
    )
}


export default StakePage