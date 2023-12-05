import Web3btn from "@/components/utils/Web3btn"
import Predition from "./Prediction"
import LoadingButton from "@/components/utils/LoadingButton"
import { useEffect, useState } from "react"
import JackpotAbi from "./../../abi/contracts/Jackpot.sol/Jackpot.json"
import TestUSDCAbi from "../../abi/contracts/mocks/TestUSDC.sol/TestUSDC.json"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { JACKPOT, TEST_USDC } from "@/libs/constants"
import { toast } from "react-toastify"
import { moneyFormat } from "@/libs/utils"
export interface IStake {
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    value5: number;
}

export interface IStakeForm {
    error: boolean;
    stakes: IStake[]
}

const StakePage = () => {

    const { address, isConnected } = useAccount()

    const [accountBal, setAccountBal] = useState(0n)
    const [allowance, setAllowance] = useState(0n)
    const [prize, setPrize] = useState(0n)

    const [stakes, setStakes] = useState<IStakeForm>({ 
        error: true, 
        stakes: [ {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
    })

    const add = () => {
        const temp = [...stakes.stakes, {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
        setStakes({...stakes, stakes: temp})
    }

    const cost = prize * BigInt(stakes.stakes.length)

    // const updateStakes = () => {
    //     setStakes()
    // }

    // const remove = (index: number) => {
    //     const temp = [...stakes.stakes].splice(index, 1)
    //     console.log(temp)
    //     setStakes({...stakes, stakes: temp})
    // }

    const getPrice = useContractRead({
        abi: JackpotAbi,
        address: JACKPOT,
        functionName: "acceptedTokenPrize",
        args: [TEST_USDC]
    })

    const balance = useContractRead({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "balanceOf",
        args: [address],
        enabled: isConnected
    })

    const getAllowance = useContractRead({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "allowance",
        args: [address, JACKPOT],
        enabled: accountBal > 0n,
        watch:true
    })

    const approve = useContractWrite({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "approve",
        args: [JACKPOT, cost]
    })

    const buyTickets = useContractWrite({
        abi: JackpotAbi,
        address: JACKPOT,
        functionName: "buyTickets",
        args: [TEST_USDC, stakes.stakes]
    })

    useEffect(() => {
        if (buyTickets.isSuccess) {
            toast.success("Ticket Bought successfully")
            setStakes({ 
                error: true, 
                stakes: [ {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
            })
        }
    }, [buyTickets.isSuccess])

    useEffect(() => {
        if (buyTickets.isError) toast.error(buyTickets.error?.name)
    }, [buyTickets.isError, buyTickets.error])

    useEffect(() => {
        if (approve.isError) toast.error(approve.error?.name)
    }, [approve.isError, approve.error])

    useEffect(() => {
        if (getAllowance.data) {
            setAllowance(getAllowance.data as bigint)
        }
    }, [getAllowance.data])

    useEffect(() => {
        if (balance.data) {
            setAccountBal(balance.data as bigint)
        }
    }, [balance.data])

    useEffect(() => {
        if (getPrice.data) {
            setPrize(getPrice.data as bigint)
        }
    }, [getPrice.data])

    console.log(getAllowance)

    return (
        <main className="flex flex-col ">

            <div className="bg-white px-4 rounded-lg  w-[600px] border-slate-200">

                <h3 className="text-center text-3xl font-bold text-gray-800 mt-4">Stake </h3>
                
                <div className="text-center">Balance {balance.data ? moneyFormat(accountBal) : "" }</div>

                <div className="text-center">Allowance {getAllowance.data ? moneyFormat(allowance) : "" }</div>

                <h3 className="text-center"> {moneyFormat(prize)} USDT Per Ticket </h3>

                <div className="flex flex-col items-center justify-center my-10">

                    { stakes.stakes.map((stake, index) => {
                        console.log(stake, index)
                        return (
                            <Predition key={index} index={index} stakes={stakes} setStakes={setStakes} />
                        )
                    })}

                    {  allowance < cost &&
                        <div className="w-80 mt-4">
                            <Web3btn color="green" loading={approve.isLoading} onClick={approve.write}>Approve </Web3btn>
                        </div>
                    }

                    <div className="w-80">
                        <Web3btn disabled={allowance < cost} loading={buyTickets.isLoading} onClick={buyTickets.write}>Stake</Web3btn>
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