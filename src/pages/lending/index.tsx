import { useContractRead, useContractWrite } from "wagmi"
import Web3btn from "@/components/utils/Web3btn"
import { EXAMPLE_LOAN, LENDING_PROTOCOL, TEST_USDC } from "@/libs/constants"
import TestUSDCAbi from "../../abi/contracts/mocks/TestUSDC.sol/TestUSDC.json"
import BorrowAbi from "@/abi/contracts/mocks/BorrowerExample.sol/BorrowerExample.json"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import convert from "ethereum-unit-converter"
import useInput from "@/hooks/useInput"
import Input from "@/components/utils/Input"
import ApproveBtn from "@/components/utils/ApproveBtn"
import useCurrentChainId from "@/hooks/useCurrentChainId"


const Lending = () => {

    const currentChainId = useCurrentChainId()

    const [allowance, setAllowance] = useState(0n)

    const amount = useInput("number")

    const fee = (amount.value || 0) as number * 9 / 1000

    const amountInEther = convert(amount.value, "ether").wei

    const feeInEther = convert(fee, "ether").wei

    const lockedFunds = useContractRead({
        abi: TestUSDCAbi,
        address: TEST_USDC,
        functionName: "balanceOf",
        args: [LENDING_PROTOCOL],
        watch: true,
        chainId: currentChainId
    })

    const { write, isLoading, isError, isSuccess, error } = useContractWrite({
        abi: BorrowAbi,
        address: EXAMPLE_LOAN,
        functionName: "borrow",
        args: [LENDING_PROTOCOL, TEST_USDC, amountInEther],
        chainId: currentChainId
    })


    useEffect(() => {
        if (isSuccess) toast.success("Borrowed and returned successfully")
    }, [isSuccess, error])

    useEffect(() => {
        if (isError) toast.error(error?.name)
    }, [isError, error])

    return (
        <main className="flex flex-col">

            <div className="my-14 mb-20 ">

                <div className="flex flex-col items-center justify-center overflow-x-auto sm:rounded-lg">

                    <div className="w-60 h-28 border-[1px] rounded-lg text-white flex flex-col justify-center items-center">
                
                        <p className="text-center">
                            {lockedFunds.isLoading ? "Loading..." : `${(Number(convert(Number(lockedFunds.data || 0), "wei").ether)).toFixed(4)} USD` } 
                        </p>
                        
                        <h3 className="text-center">Total Locked Funds</h3>

                    </div>

                    <div className="text-white mt-8 w-80">
                            
                        <h3 className="text-center text-xl font-semibold">Take Flash Loan</h3>

                        <Input type="number" value={amount.value} onChange={amount.setValue} />

                        <ApproveBtn 
                            amount={feeInEther}
                            tokenAddress={TEST_USDC} 
                            spenderAddress={EXAMPLE_LOAN} 
                            allowance={allowance}
                            setAllowance={setAllowance}
                            />
                    
                        <div className="w-80">
                            
                            <Web3btn loading={isLoading} onClick={write}>  Pay {fee} USDC  </Web3btn>
                        
                        </div>

                    </div>

                </div>

            </div>

            <a target="_blank" className="text-center text-white" href="https://github.com/Joshuajee/la-chance/blob/master/protocol/contracts/interface/IFlashBorrower.sol">View Our Interface here</a>

        </main>
    )
}


export default Lending