import Web3btn from "@/components/utils/Web3btn"
import { useEffect } from "react"
import TestUSDCAbi from "../../abi/contracts/mocks/TestUSDC.sol/TestUSDC.json"
import { Address, useAccount, useContractRead, useContractWrite } from "wagmi"
import { toast } from "react-toastify"


interface IProps {
    tokenAddress: Address,
    spenderAddress: Address,
    allowance: bigint,
    setAllowance: (allowance: bigint) => void,
    amount: bigint
}

const ApproveBtn = ({ tokenAddress, spenderAddress, allowance, amount, setAllowance} : IProps) => {

    const { address } = useAccount()

    const getAllowance = useContractRead({
        abi: TestUSDCAbi,
        address: tokenAddress,
        functionName: "allowance",
        args: [address, spenderAddress],
        watch:true
    })

    // const balance = useContractRead({
    //     abi: TestUSDCAbi,
    //     address: tokenAddress,
    //     functionName: "balanceOf",
    //     args: [address],
    //     enabled: isConnected
    // })

    const approve = useContractWrite({
        abi: TestUSDCAbi,
        address: tokenAddress,
        functionName: "approve",
        args: [spenderAddress, amount]
    })

    useEffect(() => {
        if (approve.isError) toast.error(approve.error?.name)
    }, [approve.isError, approve.error])

    useEffect(() => {
        if (approve.isSuccess) toast.success("Approved Successfully")
    }, [approve.isSuccess])

    useEffect(() => {
        if (getAllowance.data) {
            setAllowance(getAllowance.data as bigint)
        }
    }, [getAllowance.data, setAllowance])

    // useEffect(() => {
    //     if (balance.data) {
    //         setAccountBal(balance.data as bigint)
    //     }
    // }, [balance.data])

    // useEffect(() => {
    //     if (getPrice.data) {
    //         setPrize(getPrice.data as bigint)
    //     }
    // }, [getPrice.data])

    console.log(getAllowance)

    if (allowance > amount) return <></>

    return (
        <div className="w-full">
            <Web3btn color="green" loading={approve.isLoading} onClick={approve.write}>Approve </Web3btn>
        </div>
    )
}


export default ApproveBtn